ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON prompts FOR SELECT USING (true);
CREATE POLICY "Admin access" ON prompts FOR ALL 
USING (auth.uid() IN ('0fa18228-1941-4fbd-a35a-53106eec0137', 'be3e4bfc-9008-4c03-a11b-8eef831df503'))
WITH CHECK (auth.uid() IN ('0fa18228-1941-4fbd-a35a-53106eec0137', 'be3e4bfc-9008-4c03-a11b-8eef831df503'));

UPDATE storage.buckets SET public = true WHERE name = 'prompt-images';
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'prompt-images');
CREATE POLICY "Admin images" ON storage.objects FOR ALL 
USING (auth.uid() IN ('0fa18228-1941-4fbd-a35a-53106eec0137', 'be3e4bfc-9008-4c03-a11b-8eef831df503'));
