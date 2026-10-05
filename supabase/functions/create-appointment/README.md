# Appointment boundary: staged rollout, no OTP yet

**Update:** the OTP backend foundation is now implemented but not enabled or
deployed. See [OTP_FOUNDATION.md](../../OTP_FOUNDATION.md) for the current proof
contract, transaction, live RLS findings, provider configuration and exact cutover
order. The compatibility behavior described below remains the default; the
earlier future-work section is superseded by that document.

The frontend exposes `createOwnerAppointment` and `createPublicAppointment` in
`src/services/apiAppointment.js`. With `VITE_APPOINTMENT_TRANSPORT=edge`, they call:

- `POST /functions/v1/create-appointment/owner`
- `POST /functions/v1/create-appointment/public`

Both accept `{ "appointment": <existing appointment payload> }` and return
`{ "data": [<saved appointment row>], "error": null }`. Errors return
`{ "data": null, "error": { "message", "code", "details"?, "hint"? } }` with a
non-2xx status. `appointmentTransport.js` unwraps HTTP errors so the existing
React Query mutation and owner foreign-key/missing-table handling still work.

## Deployment and current limitations

The repository previously referenced deployed `public-salon` and
`invalidate-public-cache` Edge Functions but included no function sources, CLI
configuration, base appointment schema, or appointment INSERT policies. The
Supabase and Deno CLIs are not installed in the inspected environment. This change
does not deploy functions or modify production RLS. Live policies, grants, and
triggers have not been verified.

1. Run `supabase/inspection/booking-boundary.sql` in the target Supabase SQL Editor.
   Confirm the ownership model and permissions described below. This script only
   reads schema metadata; it is not a migration.
2. In an environment with the Supabase CLI installed and authenticated, deploy:
   `supabase functions deploy create-appointment --project-ref <project-ref> --no-verify-jwt`.
   The gateway JWT check is disabled for this function only; **the handler itself
   validates every booking caller with Auth `getUser(token)`**. Anonymous requests
   are rejected on both routes. No service-role key is needed. Supabase provides
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the function runtime.
3. Test both routes with real accounts, including reward bookings and QR lookup.
4. Set `VITE_APPOINTMENT_TRANSPORT=edge` in the frontend deployment environment
   and rebuild/redeploy the frontend. Existing environments default to `direct`
   until the function is available. This staging setting is not verification or
   authorization; it must be removed before OTP enforcement goes live.

There is **no automatic direct-INSERT fallback** when the edge transport fails.
Do not retry an ambiguous network failure without checking for a saved booking.
Idempotency and atomic availability checks are still future work.

## Authorization

`authorizeOwnerBooking` reads the validated Auth user, requires
`appointment.owner_id === user.id`, and queries `profiles` for that ID with
`role = 'owner'`. This follows `apiSalonSettings`, `apiOwnerId`, and the reward
migrations: the owner's profile identifies the salon. A client selecting the
owner URL or sending `mode`, `isOwner`, `source`, or `skipVerification` does not
grant ownership. The handler assigns `source` after authorization.

`requirePublicBookingIdentity` currently accepts a valid signed-in user, assigns
`client_id` from Auth, forces the existing public defaults (`Pending`,
`Pay at Salon`, `source = client`), and discards owner-only `reward_profile_id`.
This is explicitly **compatibility authorization, not booking email verification**.
It does not claim that the payload's contact email has been verified. Anonymous
public booking is not enabled; the existing frontend already assumes `user.id`.

The exact future verification gate is `requirePublicBookingIdentity` in
`handler.js`, called immediately before the appointment INSERT. No request flag
is consulted to skip this gate. The owner authorization branch is independent.

Each request creates a Supabase client with the caller's Authorization header and
the anon API key. Reads and writes therefore retain RLS and the caller's
`auth.uid()`, following [Supabase's user-context pattern](https://supabase.com/docs/guides/functions/auth-legacy-jwt).
Auth validation uses [getUser(token)](https://supabase.com/docs/reference/javascript/auth-getuser),
not locally decoded JWT claims or editable user metadata.

## Existing flow and compatibility

- Owner: `CreateAppointmentForm` -> `AppointmentPage.handleSubmitAppointment` ->
  `useBookingSubmit('owner')` -> `useCreateAppointment(createOwnerAppointment)`.
- Public and client dashboard: `ClientAppointmentPageLayout` ->
  `useClientBooking.handleNext` -> `useBookingSubmit('client')` ->
  `useCreateAppointment(createPublicAppointment)`.
- `useBookingSubmit` still owns shared normalization, totals, availability
  preflight, notifications, owner local drafts and FK retry. React Query
  invalidation/error handling is unchanged.
- `useResolveClient` still finds/creates owner walk-ins and links client profiles
  before booking. These profile writes are not covered by the new appointment
  boundary. Public profile matching by contact/name must not become proof of
  verified identity; move/review public linking during the OTP implementation.
- URL salon selection and `services` preselection in `useBookingServices` are
  unchanged. No UI or external website handoff changes were made.
- `.insert(...).select('*')` returns the database row, including reward-trigger
  adjustments. The public success callback still uses the first saved row to
  render `BookingPass`. `getClientBookingPasses` depends on `client_id = user.id`;
  owner QR verification depends on matching `owner_id` and appointment `id`.
  A future anonymous verified visitor will need a deliberate identity/pass-access
  design; possession of a QR is not an identity credential.
- `validate_booking_reward` uses `auth.uid()` to distinguish owners and clients,
  validates all `reward_service_ids`, recalculates totals, and consumes rewards
  within the INSERT transaction. The caller-scoped database client preserves that
  context. Replacing it with a service-role write without adapting reward identity
  would break these assumptions.

## Multi-service findings

No `appointment_services` schema, queries, writes, or references exist in the
inspected repository. Its deployed existence and intended contract cannot be
established from this code; do not assume columns or insert junction rows yet.

The current payload stores a joined `service_name`, summed price/duration, and
only `services[0].id` in `service_id`. A complete ID list is sent only when a
reward is used (`reward_service_ids`). Ordinary multi-service rows therefore do
not retain every service ID in the visible implementation. Neither schema nor
that behavior changes in this step.

The next request contract should include all selected service IDs in a separate
`service_ids` array, even without rewards. The server must load active services
for the target salon and calculate authoritative names/prices/durations. If the
deployed `appointment_services` table is the intended association, confirm its
columns/constraints/triggers and persist its rows atomically with the appointment.
Keep the first `service_id` and saved-row response compatible where needed.

## RLS and remaining bypasses

Existing migrations cover staff storage/ratings and rewards, not base appointment
INSERT policies or profile ownership protections. **Inspect deployed appointments
INSERT/ALL policies and grants before enabling enforced OTP.** Also inspect
`appointment_services`, profile role/identity updates, and existing booking RPCs.
No policies are invented or replaced by this change.

Direct browser INSERT remains available in the transitional transport. Even
after enabling edge routing, callers can address the database directly wherever
deployed RLS/grants permit it. Anonymous access cannot be ruled out; authenticated
client access currently supports working bookings. Both must be audited and any
non-owner insertion path closed or made verification-aware before OTP enforcement.
Frontend routing alone cannot accomplish this.

The edge boundary still accepts client-computed ordinary service names, totals,
duration, staff and contact fields. Its allowlist prevents arbitrary-column
assignment, but does not make these values authoritative. Availability remains a
frontend check and is not atomic. These are existing limitations, not OTP proofs.

## Next OTP step

First inspect the live schema/policies with the read-only script. Then implement
a server-owned challenge/verification record with expiry, attempt limits and
single-use consumption bound to email, salon, complete service selection and
booking intent. Replace `requirePublicBookingIdentity` with proof validation and
server-derived identity; keep owner JWT/ownership checks independent and OTP-free.

Verification consumption, availability, appointment creation, associations and
reward redemption need an atomic database operation. Introduce an audited
server-only RPC/persistence mechanism and corresponding minimal RLS/grant changes;
preserve or deliberately adapt the reward trigger's authenticated identity. The
current caller-scoped INSERT will also be denied if client INSERT permission is
simply revoked, so those changes must ship together. Remove the legacy direct
transport, test direct REST/RPC bypass attempts, and retain `{ data: [row], error }`.
Only then enable enforced OTP. None of these OTP changes are implemented here.

## Verification

`npm run test:booking` runs Node tests for JWT/ownership rejection, public identity,
forged flags, saved-row/reward fields, database errors, CORS and transport behavior.
They use mocked Auth/database clients; they do not verify deployed RLS or execute
database reward triggers. Run `deno check supabase/functions/create-appointment/index.ts`
where Deno is available and exercise the deployed runtime before switching traffic.

Manual tests after deployment and with edge transport enabled:

1. Owner: existing client, new walk-in, no-preference staff, multiple services;
   verify saved details, status, notifications and dashboard refresh.
2. Owner: valid reward, invalid reward, FK retry on a compatible test database;
   confirm original database error details remain available.
3. Client: normal and reward booking, including external `?services=1,2` handoff;
   verify totals, Pending status, confirmation, QR download and My Appointments.
4. Owner: scan a saved pass; another salon must not retrieve it.
5. Call owner endpoint with no/expired JWT, a client JWT, and another owner's JWT;
   expect 401/403 and no new appointment. Repeat with forged ownership flags.
6. Call public endpoint with a valid client JWT and forged `client_id`/`source`;
   the saved identity must be the Auth user and source must be `client`.
   Anonymous public requests must return 401 in this compatibility stage.
7. Make the function unavailable; confirm edge transport reports failure without
   issuing a browser INSERT. Check for a saved booking before manually retrying.
8. In staging, explicitly test direct anonymous/authenticated REST and existing
   RPC insertion. Record the result for the RLS work; this step does not close them.
