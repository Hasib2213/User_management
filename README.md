# User Management System

This is a full-stack web application for user management with role-based access control (RBAC), built as per the SRS for World IT Ltd.

## Tech Stack
- Frontend: React.js, React Bootstrap (for responsive UI), Axios, React Router.
- Backend: Django, Django REST Framework, SimpleJWT.
- Database: PostgreSQL.
- Other: JWT for auth, SMTP for emails.

## Features
- User registration with email verification.
- Login with role-based redirection.
- Password reset via email.
- Profile management.
- Admin panel for user management and activity logs.
- Secure session/token handling.
- Responsive design (mobile-friendly).
- Activity logging.
- RBAC as per SRS table.

## Setup Instructions

### Backend (Django)
1. Install Python 3.12, PostgreSQL.
2. Create DB: `psql -U postgres -c "CREATE DATABASE user_db;"`
3. Clone repo, cd to backend.
4. `pip install -r requirements.txt` (includes django, djangorestframework, djangorestframework-simplejwt, psycopg2, python-dotenv).
5. Update `.env` with EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, SECRET_KEY.
6. `python manage.py makemigrations`
7. `python manage.py migrate`
8. `python manage.py createsuperuser` (for initial admin).
9. `python manage.py runserver`

### Frontend (React)
1. Install Node.js.
2. cd to frontend.
3. `npm install` (includes react-bootstrap, axios, react-router-dom).
4. Update `src/api.js` with backend URL if needed (default: http://localhost:8000).
5. `npm start`

### Database Dump
- See `database_dump.sql` for schema export.

### Screenshot of Database Schema
(Attach or view in repo: users table and activity_logs table as per SRS.)

### Documentation
- Code is commented.
- API Endpoints: /api/register, /api/login (JWT), /api/verify/<token>, /api/forgot, /api/reset/<token>, /api/profile, /api/admin/users, etc.

### Test Cases
- Register valid: Success, email sent.
- Login invalid: Error.
- Access admin as client: Denied.
- Reset password: Success.
- Edit profile: Changes reflected.

Run on mobile browser to test responsiveness.