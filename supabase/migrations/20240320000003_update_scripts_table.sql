-- Add missing columns to scripts table
ALTER TABLE scripts
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'director' CHECK (type IN ('director', 'choir', 'solfa')),
ADD COLUMN IF NOT EXISTS choir_id UUID REFERENCES choirs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for scripts
DROP POLICY IF EXISTS "Directors can view all scripts" ON scripts;
DROP POLICY IF EXISTS "Members can view their choir's scripts" ON scripts;
DROP POLICY IF EXISTS "Directors can create scripts" ON scripts;
DROP POLICY IF EXISTS "Directors can update scripts" ON scripts;
DROP POLICY IF EXISTS "Directors can delete scripts" ON scripts;

-- Create new policies that allow all access (temporary until auth is implemented)
CREATE POLICY "Allow all access to scripts"
    ON scripts FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable RLS
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY; 