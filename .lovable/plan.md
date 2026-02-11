

# School Management System — Full Build Plan

## Overview
A comprehensive school management system with 4 user roles (Admin, Teacher, Student, Parent), 16 modules, Supabase backend with authentication, role-based access control, and pre-loaded demo data.

---

## Phase 1: Foundation & Auth

### Authentication & Role System
- Login page with username/password authentication via Supabase Auth
- Role-based access control using a separate `user_roles` table (admin, teacher, student, parent)
- Protected routes — each role only sees their own pages
- Session management and logout

### Default Demo Accounts
- Admin, Teacher, Student, and Parent accounts pre-loaded with sample data

---

## Phase 2: Dashboards (4 role-specific dashboards)

### Admin Dashboard
- Overview cards: total students, staff, today's attendance, pending fees
- Low stock alerts, recent activities, upcoming events, financial summary
- Quick action buttons for common tasks

### Teacher Dashboard
- My classes, today's schedule, pending assignments to grade, recent announcements

### Student Dashboard
- Today's timetable, recent grades, pending assignments, attendance %, fee status

### Parent Dashboard
- Child's overview, grades, attendance summary, fee status, announcements

---

## Phase 3: Student Management
- Student registration with full profile (name, DOB, class, section, contacts, medical info)
- Auto-generated student IDs and roll numbers
- Student list with search/filter by class, section
- Student profile view with academic summary

## Phase 4: Staff Management
- Staff records (personal info, designation, department, qualifications)
- Employee ID generation
- Staff list and profile views

## Phase 5: Attendance
- Daily class-wise attendance marking (Present, Absent, Late, Half-day)
- Attendance history and reports with charts
- Student and class attendance summaries
- Leave application and approval workflow

## Phase 6: Academics — Grades & Exams
- Subject-wise grade entry with multiple assessment types
- Grade calculation (A-F, percentages, ranks)
- Report card generation with teacher remarks
- Exam scheduling and results management

## Phase 7: Timetable
- Class timetables (day/period grid with subjects and teachers)
- Teacher personal schedules
- Room allocation display

## Phase 8: Assignments & Homework
- Assignment creation by teachers (title, description, due date, marks)
- Student submission tracking
- Grading with feedback

## Phase 9: Fee Management
- Class-wise fee structure configuration
- Payment recording with receipt generation
- Student fee status tracking and defaulter lists
- Fee collection reports

## Phase 10: Finance & Accounting
- Income and expense tracking with categories
- Salary management and payslip generation
- Financial reports (income statement, monthly summaries)

## Phase 11: Library Management
- Book catalog (title, author, ISBN, copies, shelf location)
- Issue/return system with due date tracking and fine calculation
- Overdue books reports

## Phase 12: Transport Management
- Vehicle and driver records
- Route management with stops and timings
- Student-to-route assignment

## Phase 13: Inventory/Stock Management
- Stock items with quantity tracking and low-stock alerts
- Add/remove/adjust stock operations
- Stock reports

## Phase 14: Discipline Management
- Incident recording (student, description, severity, reporter)
- Action tracking and resolution status
- Discipline history per student

## Phase 15: Communication
- School-wide and class-specific announcements
- Internal messaging between roles
- Notification system for events, fees, assignments

## Phase 16: Events & Calendar
- Event creation with types (sports, academic, cultural)
- Monthly calendar view with holidays, exams, events

## Phase 17: Reports & Settings
- Academic and administrative report generation with charts
- System settings (school info, academic year, grading system)
- Theme/preference options

---

## Design & UX
- Clean, modern interface with sidebar navigation
- Responsive/mobile-friendly layout
- Role-based navigation — users only see relevant menu items
- Consistent card-based layouts with Tailwind and shadcn/ui components
- Charts via Recharts for analytics and attendance/grade visuals

## Database (Supabase)
- ~20+ tables with proper relationships and foreign keys
- Row-level security policies per role
- Security definer functions to prevent RLS recursion
- Demo data seeded for all modules

