
-- Step 1: Create schools table
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  logo_url text,
  academic_year text DEFAULT '2025-2026',
  grading_system text DEFAULT 'letter',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Step 2: Create school_user_assignments table
CREATE TABLE public.school_user_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, school_id)
);
ALTER TABLE public.school_user_assignments ENABLE ROW LEVEL SECURITY;

-- Step 3: Policies for schools
CREATE POLICY "Admins can manage schools" ON public.schools FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Assigned users can view schools" ON public.schools FOR SELECT
  USING (id IN (SELECT school_id FROM public.school_user_assignments WHERE user_id = auth.uid()));

-- Step 4: Policies for school_user_assignments
CREATE POLICY "Admins manage school assignments" ON public.school_user_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users view own school assignments" ON public.school_user_assignments FOR SELECT
  USING (auth.uid() = user_id);

-- Step 5: Add school_id to all relevant tables
ALTER TABLE public.students ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.staff ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.classes ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.subjects ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.attendance ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.assignments ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.assignment_submissions ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.exams ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.grades ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.fee_structure ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.fee_payments ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.finance_transactions ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.library_books ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.book_issues ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.transport_vehicles ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.transport_routes ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.inventory ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.discipline_incidents ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.events ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.announcements ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.timetable ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.required_materials ADD COLUMN school_id uuid REFERENCES public.schools(id);
ALTER TABLE public.leave_applications ADD COLUMN school_id uuid REFERENCES public.schools(id);

-- Step 6: Update grades RLS for teacher/student restriction
DROP POLICY IF EXISTS "Admins/Teachers can manage grades" ON public.grades;
DROP POLICY IF EXISTS "Authenticated can view grades" ON public.grades;

CREATE POLICY "Admins can manage all grades" ON public.grades FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers manage own subject grades" ON public.grades FOR ALL
  USING (
    has_role(auth.uid(), 'teacher'::app_role) AND
    subject_id IN (SELECT id FROM public.subjects WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Students view own grades" ON public.grades FOR SELECT
  USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

CREATE POLICY "Parents view children grades" ON public.grades FOR SELECT
  USING (student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid()));

-- Step 7: Helper function and trigger
CREATE OR REPLACE FUNCTION public.get_user_school_ids(_user_id uuid)
RETURNS SETOF uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT school_id FROM public.school_user_assignments WHERE user_id = _user_id
$$;

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Indexes
CREATE INDEX idx_students_school_id ON public.students(school_id);
CREATE INDEX idx_staff_school_id ON public.staff(school_id);
CREATE INDEX idx_classes_school_id ON public.classes(school_id);
CREATE INDEX idx_school_user_assignments_user ON public.school_user_assignments(user_id);
CREATE INDEX idx_school_user_assignments_school ON public.school_user_assignments(school_id);
