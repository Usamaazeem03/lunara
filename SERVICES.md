# Services Feature

## 1. Purpose

The Services section is the salon owner's catalog-management screen. It gives an owner a place to view the services belonging to the resolved salon owner, group them by category, inspect price and duration, and create, edit, or delete catalog entries.

The feature currently supports:

- Loading services for one `owner_id`.
- Displaying normalized category labels, icons, formatted prices, durations, and active/inactive status.
- Filtering the catalog by category.
- Paginating the visible catalog in groups of six.
- Adding a service through a modal form.
- Editing an existing service through the same form.
- Deleting a service after confirmation.
- Showing service statistics, including total services, average price, category count, and most-booked service.

The feature is responsible for the owner-facing service catalog UI and its CRUD orchestration. Persistence is delegated to `src/services/apiServices.js`, while TanStack Query owns fetched and mutated server data.

## 2. Services Feature Overview

The main owner flow is:

```text
ServicesPage.jsx
  -> useServicesPage()
    -> useOwnerId()
    -> useCurrencyCode(ownerId)
    -> useServices(ownerId, currencyCode)
      -> TanStack Query
        -> getServices(ownerId)
          -> Supabase services table
    -> useDeleteService(ownerId)
    -> servicesPageReducer (local page/UI state)
  -> ServiceFilter, ServiceCard, CreateServiceForm, ServicesStats
```

Create and update are initiated by `CreateServiceForm`, which calls `useCreateService` or `useUpdateService`. Delete starts in `ServiceCard`, passes through `useServicesPage` for confirmation, and then calls `useDeleteService`.

React state ends at local interaction state such as `showForm`, the reducer's form snapshot, the form library's field state, and the page number. Server state begins with the service list and mutation status managed by TanStack Query. Supabase is the persistence layer. Category lists, filtered services, mapped display values, and statistics are derived values rather than separately stored page state.

## 3. Folder and File Structure

```text
src/
├── features/
│   └── services/
│       ├── ServicesPage.jsx
│       │   └── Owner-facing page/container; composes the feature UI.
│       ├── useServicesPage.js
│       │   └── Page orchestration: owner, currency, query, reducer, filtering, notifications, delete confirmation.
│       ├── servicesPageReducer.js
│       │   └── Local page state, reducer actions, EMPTY_FORM, and getFormValues().
│       ├── useServices.js
│       │   └── TanStack Query read hook and server-row-to-display mapping.
│       ├── useCreateService.js
│       │   └── TanStack Query create mutation.
│       ├── useUpdateService.js
│       │   └── TanStack Query update mutation.
│       ├── useDeleteService.js
│       │   └── TanStack Query delete mutation and pending deleted ID.
│       ├── CreateServiceForm.jsx
│       │   └── Add/edit form using React Hook Form and the create/update hooks.
│       ├── ServiceCard.jsx
│       │   └── Displays one mapped service and exposes Edit/Delete actions.
│       ├── ServiceFilter.jsx
│       │   └── Renders category filter buttons.
│       ├── ServicesStats.jsx
│       │   └── Derives catalog and appointment statistics.
│       ├── BottomActionBar.jsx
│       │   └── Client-side pagination controls.
│       ├── SERVICE_CATEGORIES.js
│       │   └── Built-in category options and category/icon normalization helpers.
│       └── ServiceCsvUpload.jsx
│           └── Empty file; CSV upload is not currently implemented.
├── services/
│   ├── apiServices.js
│   │   └── Supabase reads and CRUD operations for services, plus appointment statistics data.
│   ├── supabase.js
│   │   └── Creates the Supabase client from Vite environment variables.
│   ├── apiOwnerId.js
│   │   └── Resolves owner ID from an override, localStorage, or authenticated Supabase user.
│   └── apiSettings.js
│       └── Loads the owner's currency code from settings.
├── globalHooks/
│   ├── useOwnerId.js
│   │   └── React Query wrapper around owner ID resolution.
│   └── useAppointments.js
│       └── Loads non-cancelled appointment service IDs for ServicesStats.
├── Shared/
│   ├── lib/serviceCategories.js
│   │   └── Re-exports the service category helpers.
│   ├── lib/toast.jsx
│   │   └── Provides confirmToast and notify calls used by the feature.
│   ├── Button.jsx
│   │   └── Shared form/page buttons.
│   └── ui/Icon.jsx
│       └── Service/category icons.
└── utils/
    └── currency.js
        └── Formats mapped service prices and statistics.
```

The owner dashboard registers the page through `src/features/Dashboard/config/ownerPages.js`, and the owner menu label is defined in `src/features/Dashboard/config/ownerMenu.js`.

## 4. Technologies Used

- **React:** Components and hooks implement the page, cards, form, filters, statistics, and pagination.
- **React hooks:** `useState` handles pagination and small component interactions; `useEffect` handles notifications and form reset synchronization; `useMemo` derives categories, filtered services, and statistics; `useReducer` handles page UI state.
- **TanStack Query:** `useServices` reads the catalog; `useCreateService`, `useUpdateService`, and `useDeleteService` perform mutations; invalidation refreshes the catalog after mutations.
- **Supabase:** `apiServices.js` calls the `services` and `appointments` tables through the shared Supabase client.
- **React Hook Form:** `CreateServiceForm.jsx` manages fields, validation, dirty state, validity, submit handling, and edit resets.
- **React Router:** The Services feature itself does not use a router hook. The owner page is registered by the dashboard routing/configuration layer.
- **Tailwind CSS:** Components use Tailwind utility classes for layout, state styling, modal presentation, cards, and responsive grids.
- **Custom hooks:** `useServicesPage`, `useServices`, the three mutation hooks, `useOwnerId`, `useCurrencyCode`, and `useAppointments` isolate feature and server concerns.
- **Toast utilities:** `notify` displays load/save/action errors and successes; `confirmToast` handles delete confirmation.
- **date-fns:** Not used by the Services feature.

## 5. State Management

### Local UI/Page State

`servicesPageReducer.js` exports `initialServicesPageState`:

```js
{
  activeCategory: "All",
  showForm: false,
  formState: EMPTY_FORM,
  saveError: "",
  saveSuccess: "",
  actionError: "",
  actionSuccess: ""
}
```

The fields currently mean:

| State            | Meaning                                                                | Current consumer                                                                          |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `activeCategory` | Category selected by the owner.                                        | `useServicesPage` derives `selectedCategory`; `ServiceFilter` displays it.                |
| `showForm`       | Whether the add/edit modal is rendered.                                | `ServicesPage`.                                                                           |
| `formState`      | Snapshot passed into `CreateServiceForm`, including `id` in edit mode. | `ServicesPage` and `CreateServiceForm`.                                                   |
| `saveError`      | Intended form-save error message.                                      | Passed to the form and toasted by `useServicesPage`; no reducer action currently sets it. |
| `saveSuccess`    | Intended form-save success message.                                    | Passed to the form and toasted by `useServicesPage`; no reducer action currently sets it. |
| `actionError`    | Intended page action error message.                                    | Rendered by `ServicesPage` and toasted; only clearing is implemented here.                |
| `actionSuccess`  | Intended page action success message.                                  | Rendered and toasted; no reducer action currently sets it.                                |

The form's actual create/update success and error notifications currently come from `useCreateService` and `useUpdateService`, not from reducer fields.

### Reducer Actions

```text
selectCategory
  -> ServiceFilter calls setActiveCategory(category).
  -> activeCategory changes.
  -> useServicesPage recalculates selectedCategory and filteredServices.
  -> The visible service list changes.

openCreateForm
  -> Owner clicks Add Service.
  -> State resets to initialServicesPageState and sets showForm to true.
  -> A blank CreateServiceForm modal opens.

closeForm
  -> Owner clicks Close, Cancel, or the modal backdrop.
  -> showForm becomes false; formState becomes EMPTY_FORM; save messages clear.
  -> The modal closes.

editService
  -> Owner clicks Edit on a ServiceCard.
  -> State resets to the initial page state, opens the form, and stores action.formState.
  -> CreateServiceForm resets its fields to that service's values and enters edit mode.

clearActionError
  -> Delete confirmation succeeds before the delete mutation starts.
  -> actionError is cleared.
  -> There is currently no reducer action that sets a new actionError.
```

Unknown actions return the current state. The reducer is pure: it only receives state/action values and returns state; it does not call Supabase, display toasts, or perform mutations.

### Server State

The service list belongs to TanStack Query because it comes from Supabase, can be loading or stale, and is shared by multiple feature components such as `ServicesPage` and `ServicesStats`. Putting the same list in `useReducer` would create two competing sources of truth and would require manual synchronization after every mutation. `useReducer` stores page interaction state; React Query stores the database-backed result.

## 6. Data Flow

### Loading Services

```text
ServicesPage
  -> useServicesPage
    -> useOwnerId
      -> getOwnerId
    -> useCurrencyCode(ownerId)
    -> useServices(ownerId, currencyCode)
      -> useQuery with servicesQueryKey(ownerId)
        -> getServices(ownerId)
          -> supabase.from("services")
            -> services table
      -> mapService for each returned row
  -> ServiceCard / ServiceFilter / ServicesStats
```

`useServices` is enabled only when `ownerId` is truthy. The query selects service fields, filters with `.eq("owner_id", ownerId)`, and orders newest first by `created_at`.

### Creating a Service

1. The owner opens the form with `openCreateForm`.
2. `CreateServiceForm` validates `name`, `category`, `price`, and `duration` with React Hook Form.
3. Submit data is mapped to database names: `duration` becomes `duration_minutes`, and `isActive` becomes `is_active`.
4. `useCreateService` calls `createServiceApi` and also adds `owner_id` to the payload.
5. `apiServices.createService` inserts into `services`, selects the created row, and returns a success object.
6. The mutation shows a success toast and invalidates `servicesQueryKey(ownerId)`.
7. The next query result reaches `useServices`, is mapped for display, and appears in the page. The form resets and closes through its per-call success callback.

### Updating a Service

1. `ServiceCard` calls `onEdit(service)`.
2. `useServicesPage.editService` calls `getFormValues(service)` and dispatches `editService`.
3. The form extracts the mapped `id`, identifies an edit session, and resets its fields from `formState`.
4. Submit builds the same database-shaped payload used for creation and calls `useUpdateService` with `{ id, newServiceData }`.
5. `apiServices.updateService` updates by `id`, selects the updated row, and returns success.
6. The mutation invalidates the owner's services query, so the refreshed service appears in the UI. The form resets and closes on mutation success.

The update API call filters by service ID only. Owner scoping is passed to the hook/query invalidation, but `apiServices.updateService` itself does not add an `owner_id` filter.

### Deleting a Service

1. `ServiceCard` calls `onDelete(service)`.
2. `useServicesPage` asks `confirmToast` to confirm deletion using `service.title`.
3. Cancellation stops the flow without a mutation.
4. Confirmation clears `actionError` and calls `useDeleteService` with the service ID.
5. `apiServices.deleteService` deletes from `services` by ID.
6. Success displays a toast and invalidates `servicesQueryKey(ownerId)`.
7. A foreign-key error containing `appointments_service_id_fkey` is converted into a flagged error with a warning message explaining that a booked service cannot be deleted and should be marked inactive instead.

The delete hook also has a general error toast, while the page supplies an `onError` callback that separately handles the booking-conflict warning. Depending on the toast implementation, a failed mutation may therefore have both hook-level and callback-level notification behavior.

## 7. CRUD Operations

### Create

- **Form:** `src/features/services/CreateServiceForm.jsx`.
- **Mutation hook:** `src/features/services/useCreateService.js`.
- **API function:** `createService` in `src/services/apiServices.js`.
- **Payload:** `name`, `category`, `description`, `price`, `duration_minutes`, `is_active`, and `owner_id`.
- **Validation:** Name and category must be non-empty; price is required and cannot be negative; duration is required and must be at least one minute. Description is optional. The active checkbox defaults to true.
- **Success:** A success toast is shown, the query key for the owner is invalidated, the form resets, and the modal closes.
- **Error:** The mutation throws the API message or fallback; the hook displays an error toast. The form's `saveError` prop is available but is not populated by the current reducer flow.

### Read

- **Hook:** `useServices(ownerId, currencyCode)`.
- **Query key:** `servicesQueryKey(ownerId)` returns `["services", ownerId ?? "all"]`.
- **Query function:** `getServices(ownerId)`.
- **Parameters:** `ownerId` scopes the Supabase query; `currencyCode` is used only when mapping price labels.
- **Owner filter:** `getServices` applies `.eq("owner_id", ownerId)`.
- **Loading/error:** `useServices` returns `isLoading`, `isFetching`, `error`, and `isError`; `useServicesPage` converts `error?.message` to `loadError` and displays/toasts it.
- **Display mapping:** Rows are mapped to titles, normalized category labels, icons, numeric values, formatted labels, and a boolean `isActive`.

### Update

- Existing database/display data enters edit mode through `ServiceCard` -> `useServicesPage.editService` -> `getFormValues`.
- `getFormValues` converts database field names and values to the form shape described in section 11.
- `useUpdateService` calls `updateServiceApi(id, newServiceData)`.
- `apiServices.updateService` updates by ID and selects the updated row.
- Query invalidation causes the read query to refresh; there is no manual list update or optimistic update.

### Delete

- `ServiceCard` starts the action.
- `confirmToast` provides confirmation/cancellation.
- `useDeleteService` runs the mutation.
- `apiServices.deleteService` deletes by ID.
- Successful deletion invalidates the owner's services query.
- Booking conflicts are detected from Supabase error code `23503` plus the constraint name `appointments_service_id_fkey`.
- General delete errors are shown through `notify.error`; the page also supplies special conflict handling.

## 8. React Query Architecture

| Hook               | Kind                           | Key/function                                                               | Enabled/pending behavior                                               | Cache behavior                                                        |
| ------------------ | ------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `useServices`      | Query                          | `servicesQueryKey(ownerId)`; `getServices(ownerId)`                        | Enabled when `Boolean(ownerId)`; returns `isLoading` and `isFetching`. | Read result is mapped for UI; mutations invalidate the same key.      |
| `useCreateService` | Mutation                       | `createServiceApi({ ...payload, owner_id: ownerId })`                      | `isCreating` is the mutation pending state.                            | `onSuccess` invalidates `servicesQueryKey(ownerId)`.                  |
| `useUpdateService` | Mutation                       | `updateServiceApi(id, newServiceData)`                                     | `isUpdating` is the mutation pending state.                            | `onSuccess` invalidates `servicesQueryKey(ownerId)`.                  |
| `useDeleteService` | Mutation                       | `deleteServiceApi(serviceId)`                                              | `isPending`; mutation `variables` is exposed as `deletingServiceId`.   | `onSuccess` invalidates `servicesQueryKey(OwnerId)`.                  |
| `useAppointments`  | Query used by stats            | `appointmentsQueryKey(ownerId)`; `getAppointmentsByOwner(ownerId)`         | Enabled when `Boolean(ownerId)`.                                       | No Services mutation invalidation is wired to this appointment query. |
| `useOwnerId`       | Query used by owner resolution | `["ownerId", resolvedOwnerId ?? "authenticated-user"]`; `getOwnerId`       | Always enabled; infinite stale/cache times.                            | Supplies the owner ID to the feature.                                 |
| `useCurrencyCode`  | Query used for formatting      | `["currencyCode", resolvedOwnerId ?? "authenticated-user"]`; `getCurrency` | Enabled when a resolved owner exists.                                  | Infinite stale/cache times.                                           |

Mutation hooks do not directly update cached service data. They invalidate the owner key and rely on a refetch. React Query is therefore the server-state source, while reducer state is limited to page/UI concerns.

## 9. useServicesPage Architecture

`useServicesPage` is the orchestration layer used by `ServicesPage`. It keeps the JSX page focused on composition and event wiring.

It combines:

- `useOwnerId()` for the salon owner scope.
- `useCurrencyCode(ownerId)` for display formatting used by `useServices`.
- `useServices(ownerId, currencyCode)` for the mapped catalog.
- `useDeleteService(ownerId)` for delete status and mutation execution.
- `useReducer(servicesPageReducer, initialServicesPageState)` for local page state.
- `useMemo` for unique categories and filtered services.
- `notify` effects for load, save, action error, and action success messages.
- `confirmToast` for delete confirmation.

It returns:

```text
categories
selectedCategory
setActiveCategory
filteredServices
isLoading
loadError
showForm
formState
saveError
saveSuccess
actionError
actionSuccess
isDeleting
deletingServiceId
openCreateForm
closeForm
editService
deleteService
```

The page does its own pagination because `currentPage` is local to `ServicesPage`; the hook returns the complete filtered list.

## 10. Reducer Architecture

`src/features/services/servicesPageReducer.js` contains `EMPTY_FORM`, `initialServicesPageState`, `servicesPageReducer`, and `getFormValues`.

The reducer transitions page state for category selection, modal opening/closing, edit-mode setup, and clearing action errors. It is intentionally pure and should stay free of Supabase calls, React Query calls, toasts, confirmation dialogs, and browser storage.

The current separation is:

```text
TanStack Query = server state from Supabase
useReducer     = local UI/page state
useMemo        = derived categories, filters, and mapped calculations
Supabase       = persistence/database
React Hook Form = field-level form state and validation
```

Do not put the fetched service array in the reducer. It is already owned by the query cache and is consumed by both `ServicesPage` and `ServicesStats`.

## 11. Form Data Mapping

Database/display rows use fields such as:

```text
id
name
description
category
price
duration_minutes
is_active
owner_id
created_at
```

The form uses:

```text
id
name
description
category
price
duration
isActive
```

`getFormValues(service)` in `servicesPageReducer.js` maps an existing service into the form shape:

- Copies `id`.
- Converts nullish `name`, `description`, and `category` to empty strings.
- Converts non-nullish `price` to a string, otherwise uses `""`.
- Converts non-nullish `duration_minutes` to the form's `duration` string, otherwise uses `""`.
- Converts `is_active` to `isActive`, defaulting to true when nullish.

Numbers are converted to strings because HTML number inputs and React Hook Form fields are edited as input values. On submit, `CreateServiceForm` maps them back to database field names, but it does not explicitly call `Number`; the browser/form payload therefore remains string-valued unless Supabase/database coercion handles it.

`useServices.mapService` creates additional display-only fields:

- `title` from `name`, defaulting to `"Untitled Service"`.
- `category` from `getCategoryLabel(service.category)`.
- `iconName` from `getServiceIcon(category)`.
- `priceValue` and `durationValue` as numeric values, with invalid values mapped to `0`.
- `priceLabel` using `formatCurrency`.
- `durationLabel` such as `"45 minutes"`.
- `isActive` as `service.is_active !== false`.

## 12. Categories and Filtering

`useServicesPage` derives categories from the mapped `services` array:

1. It takes each `service.category`.
2. It removes falsy values.
3. It passes the values through a `Set` to remove duplicates.
4. It prepends `"All"`.

`selectedCategory` is defensive: if the reducer's `activeCategory` is no longer present in the current categories, it falls back to `"All"` without dispatching a state change.

`filteredServices` returns all services for `"All"`; otherwise it keeps services whose mapped category equals the selected category. Both category construction and filtering use `useMemo`, keyed by the service list and selected category, so they are recalculated when their inputs change rather than on every unrelated render.

Category normalization is performed in `SERVICE_CATEGORIES.js`. Known values and related words can map to `Hair`, `Grooming`, `Skin`, `Spa`, `Nails`, or `Kid's`; unknown non-empty values are trimmed and retained. Empty values become `General` for display mapping.

The page then slices `filteredServices` into six-service pages. The page number is persisted in `sessionStorage` under `lunara-services-page`; changing category resets it to page 1.

## 13. Notifications and Error Handling

- **Loading errors:** `getServices` logs the Supabase error and throws `"Services could not be loaded!"`. `useServicesPage` exposes `loadError`, calls `notify.error`, and renders the message.
- **Create errors:** `useCreateService` throws the API result message when `success` is false or uses the API error/fallback. Its `onError` displays a toast.
- **Update errors:** `useUpdateService` follows the same pattern and displays a toast.
- **Delete errors:** `useDeleteService` displays a general error toast. `useServicesPage` also supplies an `onError` callback.
- **Booking conflicts:** `getServiceMutationError` recognizes Supabase code `23503` with `appointments_service_id_fkey`, creates an error with `isServiceBookingConflict`, and explains that the service should be marked inactive instead. The page handles that flag with `notify.warning`.
- **Confirmation cancellation:** A false result from `confirmToast` returns before dispatching or mutating.
- **Success notifications:** Create, update, and delete mutation hooks display their own success toasts. `useServicesPage` also watches reducer success fields, but the current reducer does not set those fields.
- **Rendered action messages:** `ServicesPage` renders `actionError` and `actionSuccess`; those state values are currently only partially wired because only `clearActionError` exists.

## 14. Database

The application code accesses a Supabase table named `services`.

Confirmed from `apiServices.js`:

| Column             | Observed use                                                         |
| ------------------ | -------------------------------------------------------------------- |
| `id`               | Selected, used as the React key, and used for update/delete filters. |
| `name`             | Service name; mapped to display `title`.                             |
| `description`      | Optional display description.                                        |
| `category`         | Category input and normalized display category.                      |
| `price`            | Price input and currency-formatted display value.                    |
| `duration_minutes` | Duration input/database field.                                       |
| `is_active`        | Active/inactive status.                                              |
| `owner_id`         | Tenant filter and create payload.                                    |
| `created_at`       | Read ordering, newest first.                                         |

The code does not contain a local SQL schema, migration, or generated database types. Therefore the following cannot be confirmed from this repository: SQL data types, primary-key declaration, nullability, defaults, indexes, exact timestamp type, and all foreign keys. The code strongly indicates that `appointments.service_id` references `services.id` because it explicitly recognizes the constraint name `appointments_service_id_fkey`, but the constraint definition itself is not present locally.

`getAppointmentsByOwner` reads `appointments.service_id` and `status`, filters by `owner_id`, and excludes `Cancelled` appointments. `ServicesStats` uses those rows to count bookings per service and identify the most popular service.

## 15. Security and RLS

RLS policies and migration files are not present in this repository, so whether RLS is enabled and the exact policy definitions cannot be determined from the code.

The application does use `owner_id` in the service read path and in create payloads:

- Reads filter `services.owner_id` to the resolved owner ID.
- Creates include `owner_id`.
- The owner ID is used in the React Query key.
- Update and delete API functions currently filter by service ID only; they do not add an owner filter.

Actual read/create/update/delete authorization therefore depends on the Supabase policies and database constraints that are outside this repository. Do not infer that client-side owner filtering is a security boundary.

## 16. Ownership / Multi-Tenant Logic

`useServicesPage` calls `useOwnerId()` without an override. `useOwnerId` uses a TanStack Query wrapper around `getOwnerId`.

`getOwnerId` resolves the ID in this order:

1. An explicit override, if one is supplied.
2. `localStorage.getItem("owner_id")`.
3. `supabase.auth.getUser()` and the authenticated user's ID.

The resolved value enters the feature as `ownerId` and is passed to `useCurrencyCode`, `useServices`, `useDeleteService`, and the create/update hooks used by `CreateServiceForm`.

`getServices(ownerId)` applies the database owner filter, preventing rows for other owners from entering the normal owner catalog query. `useCreateService` adds the owner ID to the insert payload. The public/client booking code also uses an owner ID from a URL query parameter or localStorage, but that is a separate loading path and is not the owner dashboard's `useServices` query.

The repository does not prove how authenticated owner profiles are related to salon records beyond the `owner_id` values used in code.

## 17. Current Component Responsibilities

| Component/file           | Responsibility                                                       | Local UI state               | Server/API state                            |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| `ServicesPage.jsx`       | Main page composition, modal placement, pagination                   | `currentPage`                | Consumes hook/query results                 |
| `useServicesPage.js`     | Feature orchestration, filtering, notifications, delete confirmation | Reducer state                | Consumes services query and delete mutation |
| `servicesPageReducer.js` | Pure page-state transitions and form mapping                         | Yes                          | No                                          |
| `CreateServiceForm.jsx`  | Add/edit fields, validation, submit mapping                          | React Hook Form, hover state | Create/update mutations                     |
| `ServiceCard.jsx`        | Present one service and emit edit/delete events                      | No                           | No direct API                               |
| `ServiceFilter.jsx`      | Present category buttons                                             | No                           | No                                          |
| `ServicesStats.jsx`      | Derive catalog and booking metrics                                   | `useMemo` derived values     | Services and appointments queries           |
| `BottomActionBar.jsx`    | Present pagination controls                                          | No                           | No                                          |
| `useServices.js`         | Fetch and map services                                               | No                           | React Query query                           |
| `useCreateService.js`    | Create service                                                       | No                           | React Query mutation                        |
| `useUpdateService.js`    | Update service                                                       | No                           | React Query mutation                        |
| `useDeleteService.js`    | Delete service and expose pending ID                                 | No                           | React Query mutation                        |
| `apiServices.js`         | Supabase service/appointment operations                              | No                           | Supabase API                                |
| `SERVICE_CATEGORIES.js`  | Category options and normalization                                   | No                           | No                                          |
| `ServiceCsvUpload.jsx`   | Placeholder file                                                     | No                           | Not implemented                             |

## 18. Important Patterns Used

- **Container/presentation split:** `ServicesPage` composes UI and delegates orchestration to `useServicesPage`; `ServiceCard`, `ServiceFilter`, and `BottomActionBar` mainly render props and emit events.
- **Custom hooks:** Query and mutation details are isolated in `useServices`, `useCreateService`, `useUpdateService`, and `useDeleteService`.
- **Reducer pattern:** `servicesPageReducer` handles the finite set of page-modal and filter transitions.
- **Server-state management:** TanStack Query owns Supabase-backed services and appointments instead of the reducer.
- **Derived state:** Categories, filtered services, mapped display values, and statistics are calculated from query results with `useMemo` or mapping functions.
- **API abstraction:** Components do not call Supabase for owner CRUD; they call hooks, which call `apiServices.js`.
- **Mutation plus invalidation:** Create/update/delete mutations invalidate the owner's services key and let React Query refetch rather than manually editing a second list.
- **Shared display normalization:** `SERVICE_CATEGORIES.js` provides a common category/icon vocabulary used by the form, query mapping, cards, and booking-related code.

## 19. How to Add a New Service Field

Use `color` as an example. Not every field needs every step, but the usual path is:

1. **Database:** Add the column in Supabase. The migration/schema is not in this repository, so this must be done in the database project.
2. **Read API:** Add `color` to the select lists in `getServices`, `createService`, and `updateService` where returned data is needed.
3. **Query mapping:** Add a display mapping in `mapService` only if cards or other consumers need a derived/display value.
4. **Reducer form defaults:** Add `color` to `EMPTY_FORM` and `initial`/reset values only if it is part of the add/edit form state.
5. **Form:** Register the input in `CreateServiceForm.jsx` and add validation if needed.
6. **Submit mapping:** Include `color` in `servicePayload` in `CreateServiceForm.jsx`.
7. **Edit mapping:** Add `color` to `getFormValues(service)` and to the form's `reset` call.
8. **Mutation hooks:** Usually no change is needed because create/update pass the payload through, unless the new field needs special transformation.
9. **Display:** Add it to `ServiceCard.jsx`, statistics, filters, or other consumers as required.
10. **Types/schema:** No TypeScript types or generated schema files were found in this repository.
11. **Other consumers:** Check booking/admin code if the field must appear outside the owner Services page.

Do not add a reducer field for a value that can remain inside React Hook Form or be derived from the query result.

## 20. How to Modify Existing CRUD Logic

### Change delete behavior

Open `src/features/services/useServicesPage.js` first for confirmation and callback behavior, then `src/features/services/useDeleteService.js` for mutation lifecycle, and `src/services/apiServices.js` for the Supabase delete and booking-conflict translation.

### Change the edit form

Open `src/features/services/CreateServiceForm.jsx` for fields, validation, reset behavior, and payload mapping. Then inspect `src/features/services/servicesPageReducer.js` for `getFormValues` and edit-mode state setup.

### Change how services are fetched

Start with `src/features/services/useServices.js` for the query key and mapping, then `src/services/apiServices.js` for the Supabase select/filter/order. Check `useOwnerId.js` if the owner scope is wrong.

### Change category filtering

Open `src/features/services/useServicesPage.js`: category generation, `selectedCategory`, and `filteredServices` all live there. Open `SERVICE_CATEGORIES.js` if the normalization or icon vocabulary itself must change.

### Change database fields

Update `src/services/apiServices.js`, `CreateServiceForm.jsx`, and `servicesPageReducer.js` together when the field participates in CRUD and edit mapping. Then update `useServices.js` or `ServiceCard.jsx` if the field has display behavior. The actual Supabase schema must be changed separately.

## 21. Common Places to Look When Debugging

```text
Services are not loading
  -> useServicesPage.js
  -> useOwnerId.js / apiOwnerId.js
  -> useServices.js query key and enabled condition
  -> apiServices.js getServices()
  -> owner_id filter
  -> Supabase environment variables
  -> Supabase RLS (not defined locally)

Create is failing
  -> CreateServiceForm.jsx validation and servicePayload
  -> useCreateService.js
  -> apiServices.js createService()
  -> services table insert/schema
  -> owner_id and RLS

Update is failing
  -> ServiceCard edit callback
  -> useServicesPage.editService()
  -> servicesPageReducer.js getFormValues()
  -> CreateServiceForm reset/edit detection
  -> useUpdateService.js
  -> apiServices.js updateService()
  -> service ID and RLS

Delete is failing
  -> ServiceCard delete callback
  -> confirmToast in useServicesPage.js
  -> useDeleteService.js
  -> apiServices.js deleteService()
  -> appointments_service_id_fkey booking conflict
  -> Supabase RLS

Wrong category or icon
  -> useServices.js mapService()
  -> SERVICE_CATEGORIES.js
  -> ServiceFilter.jsx / ServiceCard.jsx

Wrong price formatting
  -> useCurrencyCode.js
  -> apiSettings.js getCurrency()
  -> utils/currency.js
  -> useServices.js mapService()

Wrong popularity statistic
  -> ServicesStats.jsx
  -> useAppointments.js
  -> apiServices.js getAppointmentsByOwner()
  -> appointments.service_id and status values
```

## 22. What NOT to Do

- Do not duplicate the fetched services array in `useReducer`; React Query already owns it.
- Do not call Supabase from `servicesPageReducer.js`; reducers must remain pure.
- Do not put owner CRUD calls directly in `ServiceCard.jsx`, `ServiceFilter.jsx`, or other presentational components.
- Do not manually maintain a second service list after a mutation; invalidate `servicesQueryKey(ownerId)` and let React Query refresh it.
- Do not pass the reducer itself through component props; expose page actions from `useServicesPage` instead.
- Do not add state for categories or filtered services; those are derived from `services` and `activeCategory`.
- Do not assume update/delete are owner-scoped merely because the hook receives `ownerId`; the current API functions filter those operations by service ID only.
- Do not delete a service with existing bookings unless the database relationship and product behavior are intentionally changed; the current code treats that relationship as a booking conflict and recommends marking the service inactive.
- Do not treat client-side `owner_id` filtering as a replacement for Supabase RLS.

## 23. Future Improvements

### Good as-is

- Keeping Supabase calls in `apiServices.js`.
- Keeping service reads and mutations in dedicated query/mutation hooks.
- Using query invalidation after CRUD instead of maintaining a second list.
- Keeping category filtering and page orchestration in `useServicesPage`.
- Keeping field validation in `CreateServiceForm`.

### Possible Improvements

- Remove or complete the unused reducer message fields, or connect mutation callbacks to them consistently. At present `saveError`, `saveSuccess`, and `actionSuccess` are exposed but not set by the reducer.
- Scope update and delete API filters by both service ID and owner ID if that matches the intended security model, and enforce the same rule server-side with RLS.
- Convert numeric form values explicitly before persistence so database types are not dependent on implicit coercion.
- Add tests for reducer transitions, `getFormValues`, category normalization, mutation invalidation, and booking-conflict translation.
- Add repository migrations or generated database types so table columns, constraints, and policies can be reviewed locally.
- Consider invalidating appointment statistics after service-related booking changes if stale popularity data becomes a problem.
- Make delete error notification ownership consistent so a single failure does not produce duplicate toasts.

### Not Needed Yet

- A separate global store for the service catalog.
- Optimistic updates before there is a demonstrated responsiveness requirement.
- A new abstraction for one-field mapping when the current API payloads remain small.
- CSV import: `ServiceCsvUpload.jsx` is empty, so adding CSV-specific architecture before implementing a product requirement would be premature.

## 24. Quick Reference

```text
Services page:
src/features/services/ServicesPage.jsx

Page hook:
src/features/services/useServicesPage.js

Reducer:
src/features/services/servicesPageReducer.js

Fetch hook:
src/features/services/useServices.js

Create hook:
src/features/services/useCreateService.js

Update hook:
src/features/services/useUpdateService.js

Delete hook:
src/features/services/useDeleteService.js

Database table:
services (Supabase)

Main state:
initialServicesPageState in servicesPageReducer.js

Main React Query key:
servicesQueryKey(ownerId) -> ["services", ownerId ?? "all"]
```

Common navigation:

```text
Change page/filter orchestration -> src/features/services/useServicesPage.js
Change local modal state -> src/features/services/servicesPageReducer.js
Change form fields/validation -> src/features/services/CreateServiceForm.jsx
Change service reads/mapping -> src/features/services/useServices.js
Change create/update/delete requests -> src/features/services/useCreateService.js,
  useUpdateService.js, useDeleteService.js, and src/services/apiServices.js
Change category labels/icons -> src/features/services/SERVICE_CATEGORIES.js
Change cards -> src/features/services/ServiceCard.jsx
Change stats -> src/features/services/ServicesStats.jsx
Change owner resolution -> src/globalHooks/useOwnerId.js and src/services/apiOwnerId.js
```

## Last Updated

2026-09-05
