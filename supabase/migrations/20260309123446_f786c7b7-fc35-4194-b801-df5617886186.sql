
-- Allow sub_admins to INSERT/UPDATE/DELETE on staff within their schools
CREATE POLICY "Sub-admins can manage school staff"
ON public.staff FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to INSERT/UPDATE/DELETE on students within their schools
CREATE POLICY "Sub-admins can manage school students"
ON public.students FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage classes within their schools
CREATE POLICY "Sub-admins can manage school classes"
ON public.classes FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage subjects within their schools
CREATE POLICY "Sub-admins can manage school subjects"
ON public.subjects FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage exams within their schools
CREATE POLICY "Sub-admins can manage school exams"
ON public.exams FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage attendance within their schools
CREATE POLICY "Sub-admins can manage school attendance"
ON public.attendance FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage fees within their schools
CREATE POLICY "Sub-admins can manage school fees"
ON public.fee_structure FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

CREATE POLICY "Sub-admins can manage school fee payments"
ON public.fee_payments FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage announcements within their schools
CREATE POLICY "Sub-admins can manage school announcements"
ON public.announcements FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage events within their schools
CREATE POLICY "Sub-admins can manage school events"
ON public.events FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage discipline within their schools
CREATE POLICY "Sub-admins can manage school discipline"
ON public.discipline_incidents FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage grades within their schools
CREATE POLICY "Sub-admins can manage school grades"
ON public.grades FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage inventory within their schools
CREATE POLICY "Sub-admins can manage school inventory"
ON public.inventory FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage library within their schools
CREATE POLICY "Sub-admins can manage school library"
ON public.library_books FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

CREATE POLICY "Sub-admins can manage school book issues"
ON public.book_issues FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage transport within their schools
CREATE POLICY "Sub-admins can manage school vehicles"
ON public.transport_vehicles FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

CREATE POLICY "Sub-admins can manage school routes"
ON public.transport_routes FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage timetable within their schools
CREATE POLICY "Sub-admins can manage school timetable"
ON public.timetable FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage finance within their schools
CREATE POLICY "Sub-admins can manage school finance"
ON public.finance_transactions FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage materials within their schools
CREATE POLICY "Sub-admins can manage school materials"
ON public.required_materials FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);

-- Allow sub_admins to manage leave applications within their schools
CREATE POLICY "Sub-admins can manage school leaves"
ON public.leave_applications FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'sub_admin'::app_role) 
  AND school_id IN (SELECT get_user_school_ids(auth.uid()))
);
