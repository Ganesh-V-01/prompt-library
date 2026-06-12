ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON prompts FOR SELECT USING (true);
CREATE POLICY "Admin access" ON prompts FOR ALL 
USING (auth.uid() = '0fa18228-1941-4fbd-a35a-53106eec0137')
WITH CHECK (auth.uid() = '0fa18228-1941-4fbd-a35a-53106eec0137');

UPDATE storage.buckets SET public = false WHERE name = 'prompt-images';
CREATE POLICY "Admin images" ON storage.objects FOR ALL 
USING (auth.uid() = '0fa18228-1941-4fbd-a35a-53106eec0137');
