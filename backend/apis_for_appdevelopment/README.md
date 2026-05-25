# APIs For App Development

This folder contains a ready-to-use copy of the backend API handlers for mobile/app integration.

Runtime API base path:

```text
http://localhost:3000/api
```

Production base path:

```text
https://your-domain.com/api
```

For protected routes, send the login token:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Main Endpoints

### Auth

- `POST /api/login`
- `POST /api/session/heartbeat`
- `POST /api/session/end`

### Students

- `GET /api/students`
- `POST /api/students`
- `DELETE /api/students/:id`
- `GET /api/student/me`
- `POST /api/student/me`

### Teachers

- `GET /api/teachers`
- `POST /api/teachers`
- `DELETE /api/teachers/:id`
- `GET /api/teacher/me`
- `POST /api/teacher/me`

### Staff

- `GET /api/staff`
- `POST /api/staff`
- `DELETE /api/staff/:id`

### Attendance

- `GET /api/student-attendance`
- `POST /api/student-attendance`
- `GET /api/teacher-attendance`
- `POST /api/teacher-attendance`

### Fees

- `GET /api/fees/payments`
- `POST /api/fees/challan-token`
- `POST /api/fees/challan-tokens`
- `POST /api/fees/manual-payment`
- `POST /api/fees/fine-charge`
- `POST /api/fees/mark-unpaid`
- `GET /api/fees/due-balances`
- `GET /api/fees/pay/:token`

### Class Fees

- `GET /api/class-fees`
- `POST /api/class-fees`
- `PUT /api/class-fees/history/:id`
- `DELETE /api/class-fees/history/:id`

### Leave Requests

- `GET /api/leave-requests`
- `POST /api/leave-requests`
- `POST /api/leave-requests/:id`
- `DELETE /api/leave-requests/:id`

### Notices And Banners

- `GET /api/special-notices`
- `POST /api/special-notices`
- `DELETE /api/special-notices/:id`
- `GET /api/banners`
- `POST /api/banners`
- `DELETE /api/banners/:id`

### Library

- `GET /api/library/issues`
- `POST /api/library/issues`
- `POST /api/library/issues/:id/return`
- `DELETE /api/library/issues/:id`

### Cafe

- `GET /api/cafe/contracts`
- `POST /api/cafe/contracts`
- `DELETE /api/cafe/contracts/:id`

### Transport

- `GET /api/transport/assignments`
- `POST /api/transport/assignments`
- `DELETE /api/transport/assignments/:id`

### Generic Module Data

Use this for app screens that store JSON module data.

- `GET /api/modules`
- `GET /api/modules/:moduleKey`
- `POST /api/modules/:moduleKey`
- `DELETE /api/modules/:moduleKey`

Example:

```http
POST /api/modules/classes
Content-Type: application/json

{
  "data": [
    {
      "id": "class-1",
      "name": "Class 1"
    }
  ]
}
```

### Other Admin APIs

- `GET /api/permissions`
- `POST /api/permissions`
- `GET /api/designation-permissions`
- `POST /api/designation-permissions`
- `GET /api/branches`
- `POST /api/branches`
- `DELETE /api/branches/:id`
- `GET /api/date-sheet`
- `POST /api/date-sheet`
- `GET /api/revenue`
- `POST /api/reset-data`
- `GET /api/admin-credentials`
- `POST /api/admin-credentials`
- `POST /api/admin-credentials/request-otp`
- `POST /api/admin-credentials/verify-otp`

## Notes

- The live Express server still uses `backend/api` and `backend/server.js`.
- This folder is a dedicated copy for app API integration reference and deployment packaging.
- Keep this folder synced when adding new app-facing endpoints.
