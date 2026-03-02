
-- Create storage bucket for school logos
INSERT INTO storage.buckets (id, name, public) VALUES ('school-assets', 'school-assets', true);

-- RLS policies for school-assets bucket
CREATE POLICY "Anyone can view school assets" ON storage.objects FOR SELECT USING (bucket_id = 'school-assets');
CREATE POLICY "Admins can manage school assets" ON storage.objects FOR ALL USING (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));
