-- Create choirs table
CREATE TABLE IF NOT EXISTS choirs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    director_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create choir_members table
CREATE TABLE IF NOT EXISTS choir_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    choir_id UUID REFERENCES choirs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('director', 'member')),
    voice_part TEXT NOT NULL CHECK (voice_part IN ('soprano', 'alto', 'tenor', 'bass')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(choir_id, user_id)
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS script_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create practice_progress table
CREATE TABLE IF NOT EXISTS practice_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    completed_sections JSONB NOT NULL DEFAULT '[]',
    practice_time INTEGER NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(script_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS choirs_director_id_idx ON choirs(director_id);
CREATE INDEX IF NOT EXISTS choir_members_choir_id_idx ON choir_members(choir_id);
CREATE INDEX IF NOT EXISTS choir_members_user_id_idx ON choir_members(user_id);
CREATE INDEX IF NOT EXISTS script_feedback_script_id_idx ON script_feedback(script_id);
CREATE INDEX IF NOT EXISTS practice_progress_script_id_idx ON practice_progress(script_id);

-- Enable Row Level Security
ALTER TABLE choirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE choir_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for choirs
CREATE POLICY "Users can view choirs they are members of"
    ON choirs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM choir_members
            WHERE choir_id = choirs.id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Directors can create choirs"
    ON choirs FOR INSERT
    WITH CHECK (auth.uid() = director_id);

CREATE POLICY "Directors can update their choirs"
    ON choirs FOR UPDATE
    USING (auth.uid() = director_id);

-- Create policies for choir_members
CREATE POLICY "Users can view choir members"
    ON choir_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM choirs
            WHERE id = choir_members.choir_id
            AND (director_id = auth.uid() OR EXISTS (
                SELECT 1 FROM choir_members
                WHERE choir_id = choirs.id
                AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Directors can manage choir members"
    ON choir_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM choirs
            WHERE id = choir_members.choir_id
            AND director_id = auth.uid()
        )
    );

-- Create policies for script_feedback
CREATE POLICY "Users can view feedback for scripts they have access to"
    ON script_feedback FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scripts
            WHERE id = script_feedback.script_id
            AND (
                user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM choir_members
                    WHERE choir_id = scripts.choir_id
                    AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can add feedback to scripts they have access to"
    ON script_feedback FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM scripts
            WHERE id = script_feedback.script_id
            AND (
                user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM choir_members
                    WHERE choir_id = scripts.choir_id
                    AND user_id = auth.uid()
                )
            )
        )
    );

-- Create policies for practice_progress
CREATE POLICY "Users can view their own progress"
    ON practice_progress FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
    ON practice_progress FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
    ON practice_progress FOR UPDATE
    USING (user_id = auth.uid()); 