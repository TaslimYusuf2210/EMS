# Recent Activity Endpoint Prompt

**To:** Backend Team

---

## Overview

The Dashboard now has a "Recent Activity" timeline showing the last 6 actions performed. We need the backend to track and return these activities.

## What to implement

### 1. Activity logging

Whenever any of these actions occur, insert a record into an `activities` table (or similar) and include it in the Dashboard response:

| Action                 | Trigger                                      | Template                                                   |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| **Employee created**   | `POST /employees`                            | "You created employee {firstName} {lastName}"              |
| **Employee deleted**   | `DELETE /employees/:id`                      | "You removed employee {firstName} {lastName}"              |
| **Department created** | `POST /departments`                          | "You created the {departmentName} department"              |
| **Department edited**  | `PUT /departments/:id` (head change, rename) | "You updated the {departmentName} department"              |
| **Note added**         | `POST /employees/:id/notes`                  | "You added a note for {firstName} {lastName}"              |
| **Document uploaded**  | `POST /employees/:id/documents`              | "You uploaded a {documentType} for {firstName} {lastName}" |
| **Education added**    | `POST /employees/:id/education`              | "You added an education record for {firstName} {lastName}" |
| **Salary updated**     | `PUT /employees/:id/salary`                  | "You updated salary for {firstName} {lastName}"            |

### 2. Activity object shape

Each activity should have:

```json
{
  "id": "string",
  "action": "You added a note for Brooklyn Simmons",
  "timestamp": "2 hours ago",
  "type": "note"
}
```

**Types:** `employee` | `employee_delete` | `department` | `department_edit` | `note` | `document` | `education` | `salary`

### 3. Timestamps

Use human-readable relative time for the `timestamp` field:

- "Just now"
- "2 minutes ago"
- "1 hour ago"
- "2 hours ago"
- "Yesterday"
- "2 days ago"
- "1 week ago"

### 4. Include in Dashboard response

Add to `GET /dashboard` (or whatever returns dashboard stats):

```json
"recentActivity": [ ... ]
```

Return the **last 6 activities** sorted by most recent first.
