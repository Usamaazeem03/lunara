# Cleanup report — 2026-10-05

Removed **131 files (21.4 MiB)**: 52 source files, including 37 component files, plus 64 standalone SVGs, 14 images, and one video. Removed two direct dependencies and three newly empty directories. Existing uncommitted changes were preserved; counts exclude files already deleted before this cleanup.

**Classification and verification**

| Classification | Items and evidence |
| --- | --- |
| SAFE TO DELETE | The complete inventory below. Source modules were disconnected from application entry points, route/component maps, tests, Edge Functions, and configuration. Imports, re-exports, literal dynamic imports, filename/symbol references, string paths, documentation, CSS and local verification scripts were checked. References within disconnected groups were removed together. Empty files and the commented-out router had no executable consumers. |
| SAFE TO DELETE | Standalone assets below had no surviving file/path references. The icon renderer reads symbols directly from the self-contained sprite; it does not construct paths to these individual SVG files. The two login photos and all imported SVG files remain. |
| POSSIBLY USED / KEEP | Translation keys, generic CSS selectors/theme tokens/fonts, component default props, and positional callback arguments. Dynamic strings, class composition, localization and fallback contracts make blanket deletion unsafe. All locale files remain byte-for-byte unchanged. |
| POSSIBLY USED / KEEP | The separate Git worktree in `.kilo/`, existing `*.local` verification artifacts, Supabase CLI metadata, manual SQL/inspection scripts, migrations, and deployment documentation. These can be used operationally outside the frontend import graph. |
| DEFINITELY USED | Route maps and their pages, booking/payment/authentication services, lazy invoice/QR imports, sprite symbols selected by name, React Query devtools, test dependencies, Tailwind/Vite/ESLint/Prettier integrations, and React type packages. |
| DEFINITELY USED | `ServicesStats.jsx` was initially flagged by a case-sensitive scan because its consumer spelled it `servicesStats.jsx`. Kept the component and corrected only the import spelling for case-sensitive builds. |
| DEFINITELY USED | `normalizeBookingEmail` and `requireVerificationId` have no external importers but are called inside the booking verification module. Kept both functions and exports. |

**Deleted files — complete inventory**

Names are relative to the directory in the first column. The component rows include obsolete landing/hero widgets, dashboard demo rows/panels, unused auth wrappers, legacy layout/navigation, and the unused mobile navbar. Active replacement components remain.

| Directory | Files deleted |
| --- | --- |
| `src/app/` | `router.jsx` |
| `src/components/` | `Checklist.jsx`, `CornerWord.jsx`, `HeroBadge.jsx`, `HeroHeadline.jsx`, `HeroHighlightItem.jsx`, `HeroMetricItem.jsx`, `HeroTrustBadges.jsx`, `HeroVideoCard.jsx`, `InitialLoader.jsx`, `Navbar.jsx`, `Note.jsx`, `QuickActions.jsx`, `SalonShareCard.jsx` |
| `src/features/auth/` | `AuthBranding.jsx`, `ForgotPasswordModal.jsx` |
| `src/features/clientSideBooking/` | `BookingStepViews.jsx` |
| `src/features/Dashboard/Admin/` | `DashboardStats.jsx` |
| `src/features/Dashboard/Client/` | `AppointmentCard.jsx`, `NextAppointmentPanel.jsx`, `QuickAction.jsx`, `RedeemPointsPanal.jsx`, `SummaryPanal.jsx` |
| `src/features/Dashboard/Client/components/` | `EarnRow.jsx`, `EmptyState.jsx`, `FeedEmptyState.jsx`, `FeedSectionHeader.jsx`, `NotificationRow.jsx`, `PreferenceRow.jsx`, `RewardRow.jsx`, `TransactionRow.jsx` |
| `src/features/Dashboard/Client/data/` | `myAppointmentPageData.js`, `notificationPageData.js`, `offersLoyaltyPageData.js`, `paymentHistoryPageData.js`, `quickActions.js` |
| `src/features/Dashboard/Client/hooks/` | `useMyAppointmentPage.js`, `useNotificationPage.js`, `useOffersLoyaltyPage.js`, `usePaymentHistoryPage.js` |
| `src/features/marketing/` | `FloatingInfoCard.jsx`, `StatsSection.jsx`, `TestimonialsSection.jsx`, `TrustBrandsSection.jsx` |
| `src/features/settings/` | `resolveOwnerId.js` |
| `src/globalHooks/` | `useCountryDetection.js` |
| `src/hooks/` | `useAuthState.js` |
| `src/pages/` | `NotFound.jsx` |
| `src/Shared/ui/` | `InfoCard.jsx` |
| `src/ui/` | `AppLayout.jsx`, `MainItem.jsx` |
| `src/Shared/` | `MobileNavbar.jsx` |
| `src/Shared/assets/icons/` | `access-control-password.svg`, `add-image.svg`, `angle-small-down.svg`, `arrow-undo.svg`, `assept-document.svg`, `barber-shop.svg`, `beard.svg`, `bell-concierge.svg`, `body-relax.svg`, `bonus-hand.svg`, `calendar-schedule.svg`, `calendar-week.svg`, `category-alt.svg`, `category.svg`, `chat-message.svg`, `chevron-double-left.svg`, `circle-outline.svg`, `clients.svg`, `close-circle-cancel.svg`, `close-x.svg`, `credit-card-alt.svg`, `date-time.svg`, `decorative-shapes.svg`, `edit-pencil.svg`, `email-envelope.svg`, `eye-crossed.svg`, `eye.svg`, `file-document.svg`, `filter-list.svg`, `finger-nail.svg`, `gift-present.svg`, `globe.svg`, `hair-care.svg`, `heart-love.svg`, `home-house.svg`, `home.svg`, `kid.svg`, `lead-management.svg`, `mascara.svg`, `mirror.svg`, `notification-bell.svg`, `palette-color.svg`, `pending.svg`, `play-button.svg`, `razor-barber.svg`, `refresh-rotate.svg`, `reminder-appointment (1).svg`, `reminder-appointment.svg`, `report.svg`, `search.svg`, `settings.svg`, `skin-care.svg`, `skip-track.svg`, `spa-treatment-person.svg`, `sparkles.svg`, `star-filled.svg`, `star-outline.svg`, `star-sparkle.svg`, `tachometer-average.svg`, `timer-clock.svg`, `trend-arrow-up.svg`, `user-profile.svg`, `user-tie-hair.svg`, `users.svg` |
| `src/Shared/assets/images/` | `Alex-dp.png`, `body.webp`, `hair-after.webp`, `hair-before.webp`, `hair.webp`, `hero-img-b.mp4`, `hero-img-b.png`, `hero-img.png`, `new-hair.webp`, `salon-interior.png`, `skin-after.png`, `skin-before.png`, `skin-glow.webp`, `skin-tip.webp`, `skin.webp` |

The 37 component files are the JSX files above other than the comment-only `src/app/router.jsx`, the compatibility re-export `src/features/clientSideBooking/BookingStepViews.jsx`, and the empty `src/pages/NotFound.jsx`.

Removed empty directories: `src/features/clientSideBooking/`, `src/features/Dashboard/Client/data/`, and `src/features/Dashboard/Client/hooks/`.

**Dependencies removed**

- `motion` and `framer-motion`: no source, dynamic import, configuration, script, or runtime consumers in this application. CSS reduced-motion variants do not use either package.
- npm also pruned their unused transitive packages `motion-dom` and `motion-utils`. The lockfile was updated offline without lifecycle scripts. Every retained lockfile package entry is unchanged; `npm ls --depth=0` succeeds.

**Dead code removed from retained files**

- Unused `Dashboard` lazy declaration and `lazy` import in `src/app/App.jsx`; active dashboard elements and route definitions are unchanged.
- Unused `MobileNavbar` import and commented JSX in `src/AppLayout/AppLayout.jsx`; obsolete commented spinner and client-filter image.
- Unused local `VIEW_TABS` in `AppointmentPage.jsx`; the tabs used by `AppointmentsFilter.jsx` remain.
- Eight uncalled helpers: `getAvatarUrl`, `deleteAvatar`, `getAvatarByUserId`, `getSavedAccount`, `clearAllSavedAccounts`, `clearSavedSessions`, `isValidSlug`, and `formatSlugToName`. All remaining avatar, session, slug, and account operations are unchanged.
- Commented-out service API implementation, old sidebar menu implementation, and obsolete currency/service-mapping code. Executable service API logic is unchanged.
- Unused floating/marquee selectors, their keyframes, and the corresponding reduced-motion rule in `src/styles/theme.css`. No remaining consumer exists; other stylesheets and general styles remain.
- ESLint now ignores the separate `.kilo` worktree and `*.local` artifacts. The original unrestricted lint ran out of memory processing those artifacts. No application rule was disabled or application source excluded.

**Validation and remaining issues**

| Check | Result |
| --- | --- |
| Production build | PASS before and after cleanup. The existing large-chunk warning remains. The unused lazy/static-import warning is gone. Generated CSS decreased from 132.49 kB to 122.24 kB. |
| Application lint | Same baseline and final result: **1 error, 55 warnings**. Error: `src/features/settings/AddWebsite.jsx:18`, `react-hooks/set-state-in-effect`. Warnings concern existing hook dependencies, primarily localization. Left unchanged to preserve behavior. Final command: `npm run lint -- --format json --output-file .cleanup.local/lint-after.json`. |
| Available test files | Same baseline and final result: **42 pass, 2 fail** using `node --test --experimental-test-isolation=none src/features/Appointments/appointmentStatsUtils.test.js supabase/tests/*.test.mjs`. |
| Existing test failures | The appointment-stat test module cannot load locale JSON without Node JSON import attributes. The OTP email adapter test expects the old onboarding sender while the implementation uses the booking sender. Neither implementation nor test expectations were changed. |
| Rewards test script | `npm run test:rewards` fails because `supabase/tests/clientRewards.test.mjs` was already absent. The script is retained rather than silently removing a promised test. |
| Imports and JavaScript/TypeScript parsing | No unresolved relative source imports or disconnected source modules remain. All application/Edge Function JS, JSX, TS and test files were parsed; Vite built the live app. No dedicated TypeScript type-check command is configured, so this is not a claim of full Deno type checking. |
| Routes and UI | **21 before/after Chromium comparisons passed** for DOM text/classes, computed styles, geometry, destination path and document language. Covered landing, client/owner sign-in and sign-up, password reset, public salon, unauthenticated dashboard redirects, and fallback routes at 390/1440 px; additional Turkish landing/sign-in/salon cases. External calls were intercepted with fixtures; authenticated workflows were not exercised against a live database. |
| Assets | No new missing browser assets. The existing `index.html` reference to missing `/vite.svg` remains; it was not deleted by this cleanup. Sprite and login-image build hashes are unchanged. |
| Protected behavior | Route definitions and route maps verified unchanged. All Supabase files, auth provider/hook, route guard, translations and sprite verified byte-for-byte against the starting working tree. No environment files were edited. |
| Dependency integrity | PASS; no retained package version or lock entry changed. |

The cleanup is complete, but the existing lint/test failures and favicon issue mean this report does not certify the project as fully production-ready. Audit data, before-edit backups and local verification scripts are retained in ignored `.cleanup.local/` for review or recovery.
