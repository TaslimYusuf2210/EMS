# Dashboard Endpoint Update Prompt

**To:** Backend Team  
**Endpoint:** `GET /dashboard` (or whatever returns dashboard stats)

---

## 1. Fix: `recentEmployees.position`

The `position` field in `recentEmployees` is returning incorrect data. The employee's actual position/role (e.g., "Senior Frontend Developer", "HR Manager") should be returned, not whatever is currently coming through.

Current `RecentEmployee` shape:

```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "department": "string",
  "position": "string", // ← FIX THIS — it's returning wrong data
  "employmentType": "string",
  "status": "string",
  "hireDate": "string",
  "photoUrl": "string | null"
}
```

---

## 2. Remove from Dashboard response

The frontend no longer uses these on the Dashboard (they've moved to the Reports page):

- **`employeesByDepartment`** — removed. Now lives at `GET /departments/employee-count` on the Reports page.
- **`growthTrend`** — removed. Now lives at `GET /reports/hiring-trend` on the Reports page.

---

## 3. Add to Dashboard response

Two new fields needed for the redesigned Dashboard:

### 3a. `departmentOverview`

A summary of each department for the Department Overview cards:

```json
"departmentOverview": [
  {
    "id": "string",
    "name": "string",
    "abbreviation": "string",
    "employeeCount": 3,
    "head": "Sarah Johnson"
  }
]
```

If a department has no head, return `"Not assigned"` for `head`.

### 3b. `recentActivity`

A feed of recent actions performed across the app. All actions are phrased as "You {action}" since they're performed by the logged-in user:

```json
"recentActivity": [
  {
    "id": "string",
    "action": "You added a note for Brooklyn Simmons",
    "timestamp": "2 hours ago",
    "type": "note"
  },
  {
    "id": "string",
    "action": "You uploaded a Resume for Cody Fisher",
    "timestamp": "yesterday",
    "type": "document"
  },
  {
    "id": "string",
    "action": "You created the Design department",
    "timestamp": "2 days ago",
    "type": "department"
  },
  {
    "id": "string",
    "action": "You updated salary for Ralph Edwards",
    "timestamp": "3 days ago",
    "type": "salary"
  },
  {
    "id": "string",
    "action": "You created employee Martin Cooper",
    "timestamp": "5 days ago",
    "type": "employee"
  }
]
```

**Types:** `note` | `document` | `department` | `employee` | `education` | `salary`

---

## Updated Response Shape (Full)

```json
{
  "success": true,
  "data": {
    "totalEmployees": 5,
    "activeEmployees": 3,
    "inactiveEmployees": 2,
    "totalDepartments": 3,
    "newEmployeesThisMonth": 1,
    "statusDistribution": {
      "active": 3,
      "inactive": 1,
      "probation": 0,
      "resigned": 1,
      "terminated": 0
    },
    "recentEmployees": [
      {
        "id": "EMP-001",
        "firstName": "Brooklyn",
        "lastName": "Simmons",
        "email": "brooklyn@mail.com",
        "phoneNumber": "+1 312...",
        "department": "Design",
        "position": "Senior UI Designer",
        "employmentType": "Full-time",
        "status": "Active",
        "hireDate": "2024-01-10",
        "photoUrl": "https://..."
      }
    ],
    "departmentOverview": [
      {
        "id": "DEV-001",
        "name": "Development",
        "abbreviation": "DEV",
        "employeeCount": 3,
        "head": "Sarah Johnson"
      }
    ],
    "recentActivity": [
      {
        "id": "act-001",
        "action": "You added a note for Brooklyn Simmons",
        "timestamp": "2 hours ago",
        "type": "note"
      }
    ]
  }
}
```
