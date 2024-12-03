-- Drop existing table if it exists
DROP TABLE IF EXISTS nutrition_plans;

-- Create nutrition_plans table
CREATE TABLE nutrition_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('weight_loss', 'muscle_gain', 'maintenance', 'custom')) NOT NULL,
    calories_target INTEGER NOT NULL,
    meals JSONB NOT NULL,
    completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own nutrition plans" ON nutrition_plans;
DROP POLICY IF EXISTS "Users can insert own nutrition plans" ON nutrition_plans;
DROP POLICY IF EXISTS "Users can update own nutrition plans" ON nutrition_plans;
DROP POLICY IF EXISTS "Users can delete own nutrition plans" ON nutrition_plans;

-- Create policies
CREATE POLICY "Users can view own nutrition plans"
    ON nutrition_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition plans"
    ON nutrition_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition plans"
    ON nutrition_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition plans"
    ON nutrition_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_nutrition_plans_updated_at ON nutrition_plans;

-- Create updated_at trigger
CREATE TRIGGER set_nutrition_plans_updated_at
    BEFORE UPDATE ON nutrition_plans
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();