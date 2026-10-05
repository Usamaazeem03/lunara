# Public salon: architecture and profile-request optimization

This README explains the public salon data flow and the changes made to stop an
unnecessary authenticated-profile request on `/salon/:slug`.

## Current salon data flow

```text
/salon/:slug
  → PublicSalonPage
  → usePublicSalon(slug)
  → getPublicSalon(slug)
  → GET /functions/v1/public-salon?slug=<slug>
  → Redis
      HIT  → cached public payload
      MISS → Supabase → public payload
```

The browser API adapter is [apiPublicSalon.js](../../services/apiPublicSalon.js).
It returns `salon`, `services`, `staff`, and `settings.currencyCode` from the Edge
Function response. [usePublicSalon.js](./usePublicSalon.js) manages this data with
React Query using `["publicSalon", slug]`.

The Edge Function and Redis HIT/MISS behavior were already working before the
profile-request optimization. They were not changed by this fix. Their deployed
implementation, cache keys, and TTL are outside the scope of this change.

## What caused the extra request?

For a signed-in visitor, the browser also requested:

```text
profiles?select=*&id=eq.<authenticated-user-id>
```

The complete call chain was:

```text
main.jsx
  → AppProviders (mounted on every route)
  → AuthProvider
  → useAuthState()
  → Supabase auth event supplies the current session/user
  → React Query enables ["auth-profile", user.id]
  → apiAuth.getAuthProfile(user.id)
  → createAuthApi.fetchProfile(user.id)
  → supabase.from("profiles").select("*").eq("id", user.id).single()
```

The query is defined in
[useAuthState.js](../auth/useAuthState.js), and the database request is in
[createAuthApi.js](../../services/createAuthApi.js).

This fetched the **visitor's authenticated profile**, not the salon profile.
It ran because the query previously enabled itself whenever a signed-in user
existed, regardless of the current route. Anonymous visitors did not trigger it.

`PublicSalonPage` already gets the salon's display information and booking owner
ID from `data.salon`. Neither the page nor its public layout needs the visitor's
profile. Supabase session tracking does not require fetching this database row.

## Files changed and why

| File | Change | Reason |
| --- | --- | --- |
| [app/providers.jsx](../../app/providers.jsx) | Removed the outer `AuthProvider` wrapper; retained `QueryClientProvider` and Query Devtools. | The auth provider needed access to React Router's current route. |
| [app/App.jsx](../../app/App.jsx) | Wrapped the existing route definitions in one parent route with `<AuthProvider />`. | Makes route context available while keeping a single auth provider mounted across navigation. Existing route declarations are preserved. |
| [app/AuthProvider.jsx](../../app/AuthProvider.jsx) | Uses `useMatch("/salon/:slug")`, passes `loadProfile: false` on that route, and renders its children through `Outlet`. | Skips the unnecessary profile query only on public salon routes, including a trailing slash. |
| [auth/useAuthState.js](../auth/useAuthState.js) | Added an optional `loadProfile` setting, defaulting to `true`; query enablement now requires it. | Preserves normal profile loading elsewhere without adding another hook or API. |
| [auth/useAuthState.js](../auth/useAuthState.js) | Made the returned `loading` state respect `loadProfile`. | A deliberately disabled profile query must not leave authentication stuck in a loading state. |

The shared `getAuthProfile` function and its database query were retained because
authenticated pages still need them. This fix changes when automatic loading is
needed, not how authenticated profiles are fetched.

## Why authentication still works

The existing session subscription remains active on every route. The following
continue to work:

- Session initialization, sign-in/sign-out events, and token refresh.
- Saved-account session handling and password-recovery state.
- Existing profile synchronization, updates, avatar handling, and cache keys.
- Profile loading and role checks on protected owner/client routes.

When navigating from `/salon/:slug` to a booking, authentication, or protected
route, `loadProfile` becomes `true`. React Query loads the visitor's profile when
needed or reuses a fresh cached profile. The auth provider does not remount just
because the route changes.

The public route does not erase an already cached authenticated profile. It only
disables automatic profile fetching while that profile is unnecessary.

## Expected network requests

For a successful initial visit with a signed-in session and no fresh query cache:

| Request | Before | After |
| --- | --- | --- |
| `GET public-salon?slug=usamasalon` | 1 | 1 |
| `GET profiles?select=*&id=eq.<visitor-id>` | 1 | 0 |

Anonymous public salon visits continue to need only the public salon data request.
React Query may reuse fresh cached data or refetch according to its existing
lifecycle settings. JavaScript, CSS, images, and normal auth/session requests are
separate from salon data requests.

## Behavior left unchanged

- `/salon/:slug` and the public page's design, translations, and currency display.
- The `public-salon` Edge Function, Redis caching, and cache invalidation.
- The booking owner ID, which still comes from `data.salon.id`.
- The existing Book Now action: saves `owner_id` and navigates to
  `/auth/client/signin?owner_id=<salon-owner-id>`.
- `/book/:ownerId`, protected routes, and appointment relationships.
- QR and share URLs: `${PUBLIC_SITE_URL}/salon/${slug}`, using the configured public site URL (default: `https://www.lunara-booking.com`).
- External website settings; no external redirect was added.

## Verification performed

Headless browser checks used the actual application with mocked Supabase responses
and a fake session. They verified:

- Before the fix: one public salon request plus one visitor-profile request.
- After the fix: one public salon request and no profile request for signed-in
  owners, signed-in clients, and anonymous visitors.
- Public salon URLs with a trailing slash also skip the profile query.
- Navigation to `/book/:ownerId` re-enables profile loading without remounting auth.
- Token refresh and sign-out still update authentication on the public page.
- Book Now preserves the salon owner ID and enables profile loading on sign-in.
- Protected owner routes retain profile loading and authenticated access.
- Anonymous access to protected routes still redirects to sign-in.

Changed-file lint and the production build passed:

```sh
npx eslint src/app/App.jsx src/app/providers.jsx src/app/AuthProvider.jsx src/features/auth/useAuthState.js
npm run build
```

Existing build warnings about bundle size and mixed static/dynamic imports remain.
These browser checks used mocked backend responses; they did not retest the live
Edge Function or Redis service.

To check the deployed behavior manually, open `/salon/usamasalon` while signed in,
inspect Network requests, and confirm that salon rendering issues the
`public-salon` request without starting a separate authenticated-profile request.
Then use Book Now or open a protected route and confirm that authentication and
profile-dependent pages still work.
