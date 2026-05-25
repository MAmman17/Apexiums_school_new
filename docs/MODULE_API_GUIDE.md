# Module Data API

Use these endpoints for modules that do not yet need a dedicated table/API. Data is stored as JSON in the `AppSettings` table.

## Endpoints

### List supported module keys

```http
GET /api/modules
```

### Load one module

```http
GET /api/modules/classes
GET /api/modules/families
GET /api/modules/bills
GET /api/modules/complain_box
```

Response:

```json
{
  "success": true,
  "moduleKey": "classes",
  "data": [],
  "updatedAt": "2026-05-25T10:00:00.000Z"
}
```

### Save one module

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

### Clear one module

```http
DELETE /api/modules/classes
```

## Current Generic Module Keys

- `aboutme`
- `annual_charges`
- `assignments`
- `assignment_uploading`
- `bills`
- `certificate`
- `classes`
- `complain_box`
- `diary`
- `exam_result`
- `exam_result_history`
- `exam_schedule`
- `exams`
- `families`
- `fee_logos`
- `finance`
- `lecture_uploading`
- `notifications`
- `portal_about`
- `quiz_uploading`
- `settings`
- `student_courses`
- `student_diary`
- `student_scheduling`
- `student_timetable`
- `stuck_off`
- `teacher_assigned_classes`
- `teacher_leave_requests`
- `teacher_scheduling`
- `teacher_timetable`
- `visitor_books`

Dedicated APIs already exist for students, teachers, staff, fees, attendance, banners, branches, library, cafe, transport, leave requests, permissions, special notices, class fees, date sheet, revenue, login, and email.
