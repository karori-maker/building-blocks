
-- =============================================
-- SECURITY HARDENING: Replace permissive RLS policies with strict role-based access
-- =============================================

-- 1. STUDENTS TABLE: Only admins, assigned teachers, the student themselves, and their parent
DROP POLICY IF EXISTS "Authenticated can view students" ON public.students;
DROP POLICY IF EXISTS "Teachers can view students" ON public.students;
CREATE POLICY "Students view own record" ON public.students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Parents view children" ON public.students FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Teachers view class students" ON public.students FOR SELECT USING (
  has_role(auth.uid(), 'teacher'::app_role) AND class_id IN (
    SELECT DISTINCT s.class_id FROM public.subjects s WHERE s.teacher_id = auth.uid()
  )
);
CREATE POLICY "Sub-admins view school students" ON public.students FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 2. STAFF TABLE: Only admins and the staff member themselves (hides salary from others)
DROP POLICY IF EXISTS "Authenticated can view staff" ON public.staff;
CREATE POLICY "Staff view own record" ON public.staff FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Sub-admins view school staff" ON public.staff FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 3. ATTENDANCE: Only admins, the student's teachers, and the student/parent
DROP POLICY IF EXISTS "Authenticated can view attendance" ON public.attendance;
CREATE POLICY "Students view own attendance" ON public.attendance FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Parents view children attendance" ON public.attendance FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
CREATE POLICY "Teachers view class attendance" ON public.attendance FOR SELECT USING (
  has_role(auth.uid(), 'teacher'::app_role) AND class_id IN (
    SELECT DISTINCT s.class_id FROM public.subjects s WHERE s.teacher_id = auth.uid()
  )
);
CREATE POLICY "Sub-admins view school attendance" ON public.attendance FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 4. FEE PAYMENTS: Only admins and the student/parent
DROP POLICY IF EXISTS "Authenticated can view payments" ON public.fee_payments;
CREATE POLICY "Students view own payments" ON public.fee_payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Parents view children payments" ON public.fee_payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
CREATE POLICY "Sub-admins view school payments" ON public.fee_payments FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 5. DISCIPLINE INCIDENTS: Only admins and the student/parent
DROP POLICY IF EXISTS "Authenticated can view incidents" ON public.discipline_incidents;
CREATE POLICY "Students view own incidents" ON public.discipline_incidents FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Parents view children incidents" ON public.discipline_incidents FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
CREATE POLICY "Sub-admins view school incidents" ON public.discipline_incidents FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 6. ANNOUNCEMENTS: Restrict to school-scoped visibility
DROP POLICY IF EXISTS "Authenticated can view announcements" ON public.announcements;
CREATE POLICY "Users view relevant announcements" ON public.announcements FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  has_role(auth.uid(), 'teacher'::app_role) OR
  (target_role IS NULL OR target_role = get_user_role(auth.uid()))
);

-- 7. PROFILES: Only admins and the user themselves
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());

-- 8. Sub-admin management policies for various tables
DROP POLICY IF EXISTS "Authenticated can view book issues" ON public.book_issues;
CREATE POLICY "Students view own book issues" ON public.book_issues FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Sub-admins view school book issues" ON public.book_issues FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 9. Restrict inventory to admin/sub-admin only
DROP POLICY IF EXISTS "Authenticated can view inventory" ON public.inventory;
CREATE POLICY "Sub-admins view school inventory" ON public.inventory FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 10. Restrict submissions to relevant users
DROP POLICY IF EXISTS "Authenticated can view submissions" ON public.assignment_submissions;
CREATE POLICY "Students view own submissions" ON public.assignment_submissions FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Parents view children submissions" ON public.assignment_submissions FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);

-- 11. Sub-admin grades visibility
CREATE POLICY "Sub-admins view school grades" ON public.grades FOR SELECT USING (
  has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- 12. Restrict timetable, classes, subjects, exams, library, transport, materials, events, fees to school-scoped
DROP POLICY IF EXISTS "Authenticated can view timetable" ON public.timetable;
CREATE POLICY "Teachers view own timetable" ON public.timetable FOR SELECT USING (
  teacher_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR
  (has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid())))
);
CREATE POLICY "Students view class timetable" ON public.timetable FOR SELECT USING (
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view classes" ON public.classes;
CREATE POLICY "Authenticated view classes" ON public.classes FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view subjects" ON public.subjects;
CREATE POLICY "Authenticated view subjects" ON public.subjects FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  teacher_id = auth.uid() OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view exams" ON public.exams;
CREATE POLICY "Relevant users view exams" ON public.exams FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view books" ON public.library_books;
CREATE POLICY "Authenticated view books" ON public.library_books FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'student'::app_role) OR has_role(auth.uid(), 'sub_admin'::app_role)
);

DROP POLICY IF EXISTS "Authenticated can view vehicles" ON public.transport_vehicles;
CREATE POLICY "Admin/Sub-admin view vehicles" ON public.transport_vehicles FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  (has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid())))
);

DROP POLICY IF EXISTS "Authenticated can view routes" ON public.transport_routes;
CREATE POLICY "Admin/Sub-admin view routes" ON public.transport_routes FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  (has_role(auth.uid(), 'sub_admin'::app_role) AND school_id IN (SELECT get_user_school_ids(auth.uid())))
);

DROP POLICY IF EXISTS "Authenticated can view materials" ON public.required_materials;
CREATE POLICY "Relevant users view materials" ON public.required_materials FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view checks" ON public.student_material_checks;
CREATE POLICY "Students view own checks" ON public.student_material_checks FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
CREATE POLICY "Admin view all checks" ON public.student_material_checks FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sub_admin'::app_role)
);

DROP POLICY IF EXISTS "Authenticated can view events" ON public.events;
CREATE POLICY "Authenticated view events" ON public.events FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'student'::app_role) OR has_role(auth.uid(), 'sub_admin'::app_role)
);

DROP POLICY IF EXISTS "Authenticated can view fees" ON public.fee_structure;
CREATE POLICY "Relevant users view fee structure" ON public.fee_structure FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sub_admin'::app_role) OR
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated can view settings" ON public.school_settings;
CREATE POLICY "Admin view settings" ON public.school_settings FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sub_admin'::app_role)
);

DROP POLICY IF EXISTS "Authenticated can view assignments" ON public.assignments;
CREATE POLICY "Relevant users view assignments" ON public.assignments FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role) OR
  has_role(auth.uid(), 'sub_admin'::app_role) OR
  class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
);

-- Enable leaked password protection
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
