
-- Table for required materials defined by admin per class/subject
CREATE TABLE public.required_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES public.classes(id),
  subject_id UUID REFERENCES public.subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for tracking whether students have obtained each material
CREATE TABLE public.student_material_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  material_id UUID NOT NULL REFERENCES public.required_materials(id) ON DELETE CASCADE,
  is_obtained BOOLEAN NOT NULL DEFAULT false,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, material_id)
);

-- RLS for required_materials
ALTER TABLE public.required_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage materials" ON public.required_materials
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can view materials" ON public.required_materials
  FOR SELECT USING (true);

-- RLS for student_material_checks
ALTER TABLE public.student_material_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/Teachers can manage checks" ON public.student_material_checks
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Authenticated can view checks" ON public.student_material_checks
  FOR SELECT USING (true);

CREATE POLICY "Students can update own checks" ON public.student_material_checks
  FOR UPDATE USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can insert own checks" ON public.student_material_checks
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );
