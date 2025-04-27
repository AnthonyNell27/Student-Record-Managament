# Backend (rec/)

Simple backend for student records.

### Structure

- `api/` – contains all PHP API endpoints
- `includes/` – database connection and shared functions

### Setup

1. Import `student_db.sql` into MySQL.
2. Set DB credentials in `includes/db.php`.
3. Host `rec/` under Apache (e.g., `http://localhost/student_rec/rec/api/...`)
