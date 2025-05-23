-- Add missing columns to scripts table
ALTER TABLE scripts
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'director' CHECK (type IN ('director', 'choir', 'solfa')),
ADD COLUMN IF NOT EXISTS choir_id UUID REFERENCES choirs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;

-- Update RLS policies for scripts
DROP POLICY IF EXISTS "Users can view their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can view choir scripts they belong to" ON scripts;
DROP POLICY IF EXISTS "Users can create their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON scripts;

-- Create new policies with proper authorization
CREATE POLICY "Directors can view all scripts"
    ON scripts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = scripts.choir_id
            AND user_id = auth.uid()
            AND role = 'director'
        )
    );

CREATE POLICY "Members can view their choir's scripts"
    ON scripts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = scripts.choir_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Directors can create scripts"
    ON scripts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = scripts.choir_id
            AND user_id = auth.uid()
            AND role = 'director'
        )
    );

CREATE POLICY "Directors can update scripts"
    ON scripts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = scripts.choir_id
            AND user_id = auth.uid()
            AND role = 'director'
        )
    );

CREATE POLICY "Directors can delete scripts"
    ON scripts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = scripts.choir_id
            AND user_id = auth.uid()
            AND role = 'director'
        )
    ); 