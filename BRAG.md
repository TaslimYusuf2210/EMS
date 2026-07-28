# 🏆 Brag Document

A daily log of things I've learned while building StaffSync.

---

## 2026-07-08

### Axios Wrappers vs Raw Axios

Learned the difference between using a pre-configured Axios wrapper vs raw Axios calls.

- **`axios.create()`** lets you pre-configure an instance with a base URL and default headers — every request through it inherits those settings.
- **Interceptors** sit between your code and the network. A _request interceptor_ can auto-attach auth tokens; a _response interceptor_ can normalize errors into a consistent shape.
- A thin wrapper like `request<T>(endpoint, options)` strips out repetition (base URL, headers, token management, error parsing) so each API call is one line.
- Trade-off: less boilerplate vs. more abstraction. Wrappers = consistency across large codebases; raw Axios = more control per call.

---

### `as const` (Const Assertion) in TypeScript

`as const` tells TypeScript to infer the narrowest possible literal type instead of a generic one.

- **Without `as const`**: `['Admin', 'Manager']` is inferred as `string[]` — loose, mutable, no specific value tracking.
- **With `as const`**: `['Admin', 'Manager'] as const` is inferred as `readonly ["Admin", "Manager"]` — frozen tuple with exact values.
- **Practical use**: Define a single source of truth for both runtime values and compile-time types:
  ```ts
  const ROLES = ["Admin", "Manager", "Employee"] as const;
  type Role = (typeof ROLES)[number]; // 'Admin' | 'Manager' | 'Employee'
  ```
- **Why it matters**: Prevents typos, eliminates magic strings, and keeps types in sync with data — no need to maintain a separate `type` and a separate array.

---

## 2026-07-09

### TanStack Query (React Query) — `useMutation`

Learned how to manage server-side mutations with TanStack Query in a multi-step registration flow.

- **`useMutation`** is for creating/updating/deleting data (POST, PUT, DELETE). Different from `useQuery` which is for fetching data (GET).
- **Destructuring**: `const { mutateAsync, isPending } = useMutation({...})` gives you:
  - `mutateAsync` — call this to trigger the mutation (returns a promise you can `await`)
  - `isPending` — boolean that's `true` while the request is in flight, perfect for loading states
- **`mutationFn`** receives exactly **one argument** — whatever you pass to `mutateAsync()`. If your API function takes multiple params, you need a wrapper:
  ```ts
  // ❌ verifyOtp(email, otp) — two args won't work
  // ✅ ({ email, otp }) => verifyOtp(email, otp) — wrapper
  ```
- **`onSuccess` / `onError`** — callbacks that fire after the mutation settles. Used for toasts, step advancement, etc.
- **Multiple mutations** can coexist in the same component, each with their own `isPending` state. Combine them with `||` for a shared loading state.
- **Pattern learned**: Validate form → call `mutateAsync` → on success, advance to next step. This keeps each step's logic clean and separated.

---

## 2026-07-10

### `@` Path Alias in Vite + TypeScript

Learned how to set up and use the `@` import alias to avoid messy relative paths.

- **Configured in two places** — Vite (for the bundler) and `tsconfig.json` (for TypeScript):

  ```ts
  // vite.config.ts
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }

  // tsconfig.app.json
  { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }
  ```

- **How it works**: `@/components/Button` → Vite resolves to `./src/components/Button` — no more `../../../../components/Button`.
- **Why it's useful**: Relative paths break when you move files. `@/` paths are always relative to `src/`, so they work from any file at any depth. Saves time counting `../` dots and prevents silent import failures.
- **Not Next.js specific** — any Vite project can use it. The alias is just a bundler-level path replacement.

---

## 2026-07-12

### `z.infer` — Extracting Types from Zod Schemas

Learned how `z.infer<typeof schema>` automatically derives TypeScript types from Zod runtime schemas.

- **`z.infer<typeof schema>`** extracts the inferred TypeScript type from any Zod schema — no need to maintain a separate interface alongside the schema.
- **Keeps types in sync**: If you add a field, change validation (e.g. `.min(2)` → `.min(5)`), or make something optional in the schema, the inferred type updates automatically.
- **Pattern**:
  ```ts
  const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });
  type User = z.infer<typeof userSchema>;
  // { name: string; email: string }
  ```
- **Handles optionals**: `z.string().optional()` → `string | undefined` in the inferred type. `z.string().default("hi")` → `string` (not `undefined`), since the default fills in.
- **Practical benefit**: Single source of truth — change the Zod schema and both runtime validation _and_ TypeScript types update together. No more mismatched interfaces.

---

## 2026-07-13

### Query Parameters in GET Requests

Learned the role of `params` in GET requests and how they map to URL query strings.

- **Query parameters** are key-value pairs appended to the URL after `?` (e.g. `GET /employees?search=Brook&department=Design&page=1&limit=10`).
- They are used to **filter, paginate, sort, and search** data without creating separate endpoints for each combination.
- The Axios `params` option automatically serializes an object into a query string — no manual string concatenation needed.
- **Example with typed params:**

  ```ts
  interface EmployeeQueryParams {
    search?: string;
    department?: string;
    page?: number;
    limit?: number;
    sortBy?: "name" | "dept" | "joined";
    sortOrder?: "asc" | "desc";
  }

  getEmployees({ search: "Brook", department: "Design" });
  // → GET /employees?search=Brook&department=Design
  ```

- All params are **optional** — the endpoint works with zero params (returns defaults) or any combination.
- The `request` helper accepts `params` in its options and passes them directly to Axios.

### `placeholderData` in TanStack Query

Learned how `placeholderData` provides fallback data while a query is loading.

- **`placeholderData`** is shown immediately — it's not cached, not persisted, just a temporary stand-in while the real fetch happens.
- Unlike `initialData` (which is treated as cached/real data), `placeholderData` is replaced the moment the actual response arrives.
- **Common use case — keeping previous data while fetching next page:**
  ```ts
  useQuery({
    queryKey: ["employees", { page: 2 }],
    queryFn: () => getEmployees({ page: 2 }),
    placeholderData: (previousData) => previousData,
  });
  ```
  This keeps the page 1 results visible while page 2 loads, avoiding a flash of empty content.
- **Also useful for providing a default shape when data might be undefined:**
  ```ts
  useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardData,
    placeholderData: { totalEmployees: 0, activeEmployees: 0, ... },
  });
  ```

---

## 2026-07-13

### Extracted all `useMutation` calls into dedicated hooks

Every mutation (login, sendOtp, verifyOtp, register, updateSettings, changePassword, createDepartment) now lives in its own hook under `src/hooks/useMutation/`. Hooks handle common logic (toasts, query invalidation) and expose `onSuccess` callbacks for component-specific behavior.

### Built a search-as-you-type employee dropdown

Used `useGetEmployees({ search, limit: 10 })` with a debounce-less text input to power a live dropdown in the department creation dialog. Learned that `{...register()}` spreads contain an `onChange` — custom handlers must go inside `register('field', { onChange: ... })`.

### Separated add/edit dialogs from inline forms

Created a reusable `Dialog` component and split a shared add/edit department form into two independent dialog components with their own state and form instances, replacing an inline form that caused layout shifts.

### Added query invalidation on mutation success

Used `queryClient.invalidateQueries({ queryKey: ['departments'] })` inside `useCreateDepartment` so the department list auto-refreshes after a new department is created — no manual refetch needed.

---

## 2026-07-14

### `unknown` vs `any` in TypeScript

`unknown` is the type-safe counterpart of `any`. Both accept any value, but `unknown` forces you to narrow the type before using it, while `any` disables all checks. Prefer `unknown` over `any` for API responses, user input, or any data you don't control.

```ts
let value: unknown;
value = "hello";
value.toUpperCase(); // ❌ Error — must narrow first

if (typeof value === "string") {
  value.toUpperCase(); // ✅ OK — narrowed to string
}
```

---

### `{...register()}` Spread Overwrites Manual `onChange`

Learned that `{...register('fieldName')}` already contains an `onChange` handler that react-hook-form needs to track the input value. If you add a separate `onChange` prop after the spread, it **overwrites** RHF's onChange — the form field stops updating.

```tsx
// ❌ RHF's onChange is overwritten — form field won't update
<input {...register('head')} onChange={(e) => setHeadSearch(e.target.value)} />

// ✅ Pass custom onChange inside register's options — both run
<input {...register('head', { onChange: (e) => setHeadSearch(e.target.value) })} />
```

The spread (`{...register('head')}`) expands to `{ onChange, onBlur, ref, name }`. Any prop placed **after** the spread with the same name replaces the spread's version. Moving the custom logic into `register()`'s second argument lets RHF wrap its own handler around yours so both execute.

---

## 2026-07-15

### Axios Response Interceptors — Deep Dive

Learned how Axios interceptors work as middleware between the server's raw response and the calling code.

- **Two handlers**: fulfilled (2xx) and rejected (4xx/5xx). The fulfilled handler passes the response through; the rejected handler normalizes errors.
- **401 interceptor**: Added a centralized handler that clears tokens and redirects to `/login` when the server returns 401 on any endpoint _except_ `/auth/login` (where 401 means "invalid credentials," not "expired session").
- **Why the exception**: The login endpoint returns 401 for wrong passwords — catching that with the session-expiry handler caused a redirect loop that looked like a page reload.
- **`ApiResponse<T>` wrapper**: Every API response passes through the generic `request<T>` helper which returns `Promise<ApiResponse<T>>`, keeping the response shape consistent across all endpoints.

### `mutate` vs `mutateAsync`

- **`mutate`** fires and forgets — no promise, no unhandled rejections. Use it when you only care about `onSuccess`/`onError` callbacks.
- **`mutateAsync`** returns a Promise — you `await` it when you need to chain logic after the mutation settles.
- If you use `mutateAsync` without `await`/`.catch()`, a rejected mutation becomes an unhandled promise rejection, which can crash the React tree and trigger a Vite HMR reload.

### React Query `onSuccess` vs `onError` — HTTP vs Business Logic

- `onSuccess` fires when the **HTTP status** is 2xx.
- `onError` fires when the **HTTP status** is 4xx/5xx.
- A backend returning `200 OK` with `{ success: false }` still hits `onSuccess` — Axios doesn't know about business-logic failures. The `data?.data?.token` check in `useLogin` is a safety net for this edge case.

### Logging In — Full Flow Traced

Mapped the complete authentication flow: form → `useLogin` mutation → `auth.ts` service → Axios → backend → token storage → `ProtectedRoute` → `Layout` → `useGetCurrentUser`.

- **`rememberMe`** determines storage: `localStorage` (persists across browser close) vs `sessionStorage` (cleared on tab close).
- **`ProtectedRoute`** checks for token string existence — it doesn't validate the token (the backend does that via `/auth/me`).
- **SMTP timeout**: Discovered the backend is trying to connect to an email server at `1.179.115.1:587` on login, which times out. Backend fix needed.

### Employee Details — Type Safety Fixes

- Created `SingleEmployeeResponse` type and added `fileUrl` to the `Document` type.
- Fixed `useGetEmployeeById` hook to unwrap the API response via TanStack Query's `select`, so components receive `Employee | undefined` directly instead of the raw `ApiResponse`.

---

## 2026-07-16

### Cross-Cutting Fixes & Cleanup

A broad round of fixes across the app:

- **`AppContext` overhaul**: Major rework of the app context provider (+49 lines) — likely related to state management improvements for the authenticated user or shared app state.
- **Auth flow cleanup**: Removed the standalone `SuccessStep.tsx` (registration success screen), simplified `Login.tsx`, and cleaned up the auth step transitions.
- **Dashboard updates**: Refreshed the dashboard page with additional data or layout tweaks.
- **Department list refactor**: Restructured `DepartmentsList.tsx` (44 lines changed, 24 deletions) for better readability and maintainability.
- **Employee pages**: Minor fixes to `EmployeeDetails.tsx` and `EmployeesList.tsx`.
- **Reports page**: Added the reports page stub/update.
- **API service fix**: Adjusted the Axios interceptor to handle auth edge cases (token expiry while user is still in the dashboard).
- **Type definitions**: Added `Department` types (`src/types/dashboard/department.ts`) to support the department CRUD work ahead.
- **Vite config**: Added config changes (likely path alias or build settings).

---

## 2026-07-17

### Department Details — View Department Fix

- Fixed `useGetDepartmentById` to unwrap the API response via TanStack Query's `select`, so `DepartmentDetails` receives the department object directly instead of the raw `ApiResponse`.
- Built out `DepartmentDetails.tsx` with a proper department info layout (displaying department name, head, employee count, etc.).
- Added comprehensive department types (`Department`, `DepartmentListResponse`, `SingleDepartmentResponse`) to `src/types/dashboard/department.ts`.

### Edit Department Dialog — Full Implementation

- Created a fully functional `EditDepartmentDialog` with form fields for department name, description, and departmental head selection.
- Wired up the dialog to pre-populate existing department data for editing.
- Added the `useCreateDepartmentPositions` mutation hook and `useGetDepartmentPositions` query hook to manage job positions within a department.
- Integrated position management into the edit dialog — you can now add positions when editing a department.
- Fixed the position creation flow to ensure positions are saved correctly with the department.

---

## 2026-07-18

### Department Update & Delete Endpoints

- **`useUpdateDepartment`**: Created the mutation hook and integrated the update department endpoint. The `EditDepartmentDialog` now successfully sends update requests.
- **`useDeleteDepartment`**: Created the mutation hook and service for deleting a department.
- **`useDeleteDepartmentPosition`**: Created the mutation hook to remove individual positions from a department.

### Edit Department Dialog — Completion

- Finished the `EditDepartmentDialog` with full position management — add and remove positions inline within the dialog.
- Cleaned up the dialog's form state, validation, and submission flow.

### Employee Create — Dialog Experimentation

- Worked on transitioning the employee creation flow from a standalone page (`EmployeeCreate.tsx`) toward a dialog-based approach.
- Made iterative fixes to the create employee dialog form (layout and logic adjustments).

---

## 2026-07-20

### Department CRUD — Completed Integration

Wrapped up the full department management flow with several improvements:

- **Department head field edge case fix** (`AddDepartmentDialog` / `EditDepartmentDialog`): Fixed the `departmental head` dropdown field edge cases — handled scenarios where the head field needed special logic for pre-selection, empty state, and form reset behavior.
- **Reusable `DeleteDepartmentDialog`**: Extracted the delete confirmation into its own reusable dialog component used by both `DepartmentDetails` and `DepartmentsList`. This eliminated duplicated confirmation logic and gave a consistent UX regardless of where the delete was triggered.
- **Edge case handling for delete flow**: Integrated delete to handle both scenarios — departments with employees assigned (block/protect) and empty departments (allow deletion). The dialog dynamically adjusts messaging based on the department state.
- **Final CRUD polish**: Cleaned up the remaining integration details across the department pages, ensuring all CRUD operations (create, read, update, delete) were fully wired end-to-end.

### Employee Management — Create & Delete Flows

- **Switched from standalone page to dialog**: Removed the separate `EmployeeCreate.tsx` page (355 lines) and migrated to an `AddEmployeeDialog` component. This keeps the employee creation experience consistent with the department pattern and avoids navigating away from the employee list.
- **Create employee logic fix**: After the architectural change from a dedicated page to a dialog, fixed the form submission logic so create employee works correctly in the new dialog context.
- **`DeleteEmployeeDialog`**: Created a dedicated delete employee confirmation dialog component with proper loading states and error handling.
- **Employee route updates**: Updated `EmployeeDetails` to include the delete button + dialog integration, added the `useDeleteEmployee` mutation hook, wired up the delete service in `employee.ts`, and refreshed `EmployeesList` to support the new dialog patterns.

### Employee Details Layout

- Fixed layout issues in `EmployeeDetails.tsx` (76 insertions, 18 deletions) — improved the arrangement of employee info sections for a cleaner, more structured display.

---

## 2026-07-21

### TanStack Query — `select` Option

Learned how `select` works as a transformer in `useQuery`.

- **`select`** is a function that runs on the fetched data **before** it reaches the component. It extracts or reshapes the response so components get exactly what they need.
- **Before `select`**: `const { data } = useGetEmployees()` → `data` is the raw `ApiResponse<EmployeesResponse>` — components have to drill with `data?.data?.employees?.map(...)` everywhere.
- **After `select: (res) => res.data`**: `data` is directly the unwrapped `EmployeesResponse` — components use `data?.employees?.map(...)`.
- **Referential stability**: If the transformed result is the same reference as the previous one, TanStack Query skips the re-render. This makes `select` more efficient than manually transforming in the component.
- **Runs on every fetch**: Each time the query refetches, `select` runs again, so the unwrapped shape stays consistent.
- **Pattern applied to multiple hooks**:

  ```ts
  // Returns the full response data (employees + pagination)
  useGetEmployees  →  select: (res) => res.data

  // Returns just the array
  useGetDepartments          →  select: (res) => res.data?.departments
  useGetDepartmentPositions  →  select: (res) => res.data?.positions
  useGetEmployeeById         →  select: (res) => res.data?.employee
  ```

---

## 2026-07-22

### Education Form Overhaul — Nigeria Data Dropdowns

Completely redesigned the education form after a debate about `qualification` vs `degree` overlap.

- **Removed `degree` field** from the `Education` type entirely. The insight: not all qualifications are degrees (e.g., RN, HND, NCE are credentials, not degrees). Each education entry now represents **one qualification** — users with multiple credentials create multiple records.
- **Qualification dropdown**: Replaced free-text input with a searchable dropdown sourced from `NigeriaDegreeTypes.js` (`tertiary_qualifications`), covering everything from certificates (RN) to postgraduate degrees (PhD).
- **Institution searchable dropdown**: Wired up `NigeriaInstitutions.js` as the data source for institution name, replacing the free-text input.
- **Field of study dropdown**: Added from Nigeria course data.

### Controlled vs Uncontrolled Input Conflict

Ran into a classic React Hook Form issue when mixing `value` prop with `register()`:

- **Problem**: The qualification/institution dropdowns used `register()` (controlled by RHF) + a local `value` state — the two fought for control and the UI glitched.
- **Fix**: Toggled between a read-only **badge** (when a value is selected) and a **search input** (when editing). Clicking the badge switches to input mode; selecting a value switches back to badge. This avoids the controlled/uncontrolled conflict entirely.

---

## 2026-07-27

### Dashboard Redesign — From Mock Data to Live API

Completely rebuilt `Dashboard.tsx` to remove redundancy and add meaningful widgets:

- **QuickActions component**: Three action cards linking to employees, departments, and reports — gives users immediate navigation targets.
- **DepartmentCards component**: Grid of department overview cards sourced from `useGetDashboardStats`. Scrollable container (`max-h-80 overflow-y-auto`) prevents layout blowout with many departments.
- **RecentActivityTimeline component**: Displays 6 recent activities initially with a "View all X activities" toggle. Expanded state is scrollable. Covers 8 activity types (employee added, department created, salary updated, etc.) with emoji icons.
- **Employment Status PieChart**: Recharts `PieChart` showing the distribution of active vs inactive vs on-leave employees.
- **Loading skeletons**: Every section has proper skeleton placeholders while data loads.
- **Removed all mock data**: Dashboard now exclusively uses `useGetDashboardStats` — no more hardcoded fallback values.

### Reports Page — Recharts Decomposition

Decomposed the monolithic `Reports.tsx` into focused sub-components:

- **EmployeeMetrics**: Stat cards (total employees, department count, new hires) + `DepartmentBreakdown` with a horizontal Recharts `BarChart`. Uses `useGetEmployeeCount` hook.
- **SalaryMetrics**: Salary stat cards (total payroll, average, highest/lowest) + `SalaryDistribution` with a vertical Recharts `BarChart`. All currency formatted as `₦` (Naira). Uses `useGetSalarySummary`.
- **HiringTrend**: Recharts `LineChart` replacing a static SVG. Uses `useGetHiringTrend` which zips `labels` + `data` into `[{ month, employees }]`.
- **Export buttons**: Direct `fetch`-based download with Bearer auth and toast notifications for success/failure.

### AppContext Elimination

Deleted `AppContext.tsx` entirely — 355 lines of mock data and shared state.

- Removed `AppProvider` wrapper from `App.tsx`.
- All data now flows through TanStack Query hooks (`useGetEmployees`, `useGetDepartments`, `useGetDashboardStats`, etc.).
- Reports page switched from `useApp()` to direct API hooks.
- Sidebar removed unused `useApp()` reference.

### Auth — Forgot & Reset Password Flow

Built the complete password recovery flow with route protection:

- **`ForgotPassword.tsx`**: Email-only form using `useForgotPassword` mutation. On success: shows a checkmark toast and navigates to `/reset-password` with email in `location.state`.
- **`ResetPassword.tsx`**: Pre-filled readonly email (from `location.state`), OTP input, new password + confirm password fields. Protected via `useEffect` redirect to `/forgot-password` if no state exists.
- **`useForgotPassword`**: `POST /auth/forgot-password` with console.log of the response on success.
- **`useResetPassword`**: `POST /auth/reset-password` with payload `{ email, otp, newPassword }`.
- **Fixed `auth.ts`**: `forgotPassword` endpoint was mistakenly pointed at `/auth/login`.

### Cloudinary Document Upload

Implemented document upload with Cloudinary's unsigned upload preset:

- **`src/services/cloudinary.ts`**: Upload utility using `auto/upload` endpoint, returns `secure_url`.
- **PDF download handling**: Designed a backend proxy endpoint approach since Cloudinary CDN blocks direct PDF access. Download function uses `fetch` with Bearer auth.
- **Progress indicators**: Visual feedback during upload.

### Notes CRUD

Wired up the notes section in employee details with full mutations:

- **`useAddNote`**: Creates a note with title + content for an employee.
- **`useDeleteNote`**: Removes a note by ID with confirmation.
- Integrated into `NotesSection.tsx` with proper loading/error states and toast feedback.

---

## 2026-07-28

### Dashboard — Empty State for Employment Status PieChart

Added an empty state to the Employment Status Distribution section when no employees exist yet.

- **Problem**: The pie chart always rendered because `statusDist` returns all 6 status keys (`active`, `inactive`, `probation`, `onleave`, `resigned`, `terminated`) — even when all values are 0. Checking `pieData.length === 0` never triggered because the array always has 6 entries.
- **Fix**: Changed the guard to `pieTotal === 0` (the sum of all status values). When no employees exist, the sum is 0 and the empty state renders with a chart icon, "No employee data yet" message, and helper text.
- **Three-state coverage**: error (`isError`) → empty (`pieTotal === 0`) → populated (pie chart + legend).
