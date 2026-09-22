# Appointment passes

After the client insert succeeds, the booking page displays a pass for the returned database row. `MyAppointmentPage` loads the signed-in client's saved appointments so passes remain available after a refresh. The QR contains only a versioned salon/appointment reference; names, prices, and statuses are not encoded in it.

The owner opens **Appointments > Verify booking / Scan QR**. Camera scanning, image upload, and pasted references all call `verifyBookingPass`. The service requires the authenticated owner, checks the salon in the reference, and filters the database lookup by both owner and appointment ID. The result displays the current status, including Pending, Cancelled, and Completed. Verification is a read operation; it does not confirm an appointment, take payment, or record check-in.

`BookingPass` displays the salon currency and supports a PNG download with appointment details and the QR. Saved images are snapshots; the owner's verification always fetches the current appointment. Passes are booking references, not identity credentials or payment receipts.

Camera decoding uses [jsQR](https://github.com/cozmo/jsQR), loaded only when needed. Camera access requires HTTPS (or localhost) and browser permission. Camera tracks stop when the dialog closes, scanning stops, or a code is found. Screenshot upload and reference entry are available without a camera.

This feature uses the existing `appointments` table and Supabase authentication. Existing row-level security must allow clients to select their own appointments and owners to select their salon's appointments. No schema or policy changes are applied by this feature.

Run `node --test --experimental-vm-modules src/features/Appointments/bookingPass/bookingPass.test.js` for QR round-trip, malformed-reference, ownership, query-filter, and status checks. Service tests use a mocked database; browser camera access and deployed database policies need integration checks with real accounts.
