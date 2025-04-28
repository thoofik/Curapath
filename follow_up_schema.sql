-- Follow-up Schema for Curapath Application
-- This SQL file creates the necessary tables and functions to manage follow-ups in Supabase

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create follow_ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR NOT NULL,
  description TEXT NOT NULL,
  follow_up_date DATE NOT NULL,
  follow_up_type VARCHAR NOT NULL CHECK (follow_up_type IN ('call', 'appointment', 'message', 'other')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on patient_id for faster lookups
CREATE INDEX IF NOT EXISTS follow_ups_patient_id_idx ON follow_ups(patient_id);

-- Create index on follow_up_date for faster date-based queries
CREATE INDEX IF NOT EXISTS follow_ups_date_idx ON follow_ups(follow_up_date);

-- Enable Row Level Security
-- Note: In some SQL environments, you might need to use:
-- ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
-- But in Supabase SQL Editor, use:
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follow_ups_updated_at
BEFORE UPDATE ON follow_ups
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Row Level Security Policies
-- These ensure that users can only access their own data

-- Policy for selecting follow-ups
CREATE POLICY select_follow_ups ON follow_ups
FOR SELECT USING (
  -- Allow authenticated users to see their patients' follow-ups
  -- Replace 'auth.uid()' with your actual user authentication check if different
  auth.role() = 'authenticated'
);

-- Policy for inserting follow-ups
CREATE POLICY insert_follow_ups ON follow_ups
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- Policy for updating follow-ups
CREATE POLICY update_follow_ups ON follow_ups
FOR UPDATE USING (
  auth.role() = 'authenticated'
);

-- Policy for deleting follow-ups
CREATE POLICY delete_follow_ups ON follow_ups
FOR DELETE USING (
  auth.role() = 'authenticated'
);

-- Create a view for overdue follow-ups
CREATE OR REPLACE VIEW overdue_follow_ups AS
SELECT *
FROM follow_ups
WHERE follow_up_date < CURRENT_DATE
AND completed = false
ORDER BY follow_up_date ASC;

-- Create a function to get upcoming follow-ups for a patient
CREATE OR REPLACE FUNCTION get_upcoming_follow_ups(p_patient_id VARCHAR, days INTEGER DEFAULT 7)
RETURNS SETOF follow_ups AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM follow_ups
  WHERE patient_id = p_patient_id
  AND follow_up_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + (days || ' days')::INTERVAL)
  AND completed = false
  ORDER BY follow_up_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to mark all overdue follow-ups as completed
CREATE OR REPLACE FUNCTION mark_all_overdue_as_completed(p_patient_id VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE follow_ups
  SET completed = true,
      updated_at = NOW()
  WHERE patient_id = p_patient_id
  AND follow_up_date < CURRENT_DATE
  AND completed = false;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Sample data insert (commented out - uncomment to use)
/*
INSERT INTO follow_ups (patient_id, description, follow_up_date, follow_up_type)
VALUES 
  ('1', 'Schedule follow-up appointment with Dr. Smith', CURRENT_DATE + INTERVAL '7 days', 'appointment'),
  ('1', 'Call patient to check on medication side effects', CURRENT_DATE + INTERVAL '3 days', 'call'),
  ('1', 'Send lab test results via secure message', CURRENT_DATE + INTERVAL '1 day', 'message'),
  ('2', 'Review treatment plan progress', CURRENT_DATE + INTERVAL '14 days', 'appointment'),
  ('2', 'Check on prescription refill', CURRENT_DATE + INTERVAL '5 days', 'call');
*/

-- Instructions for use:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Adjust the Row Level Security policies based on your authentication model
-- 3. Uncomment and run the sample data if needed for testing 