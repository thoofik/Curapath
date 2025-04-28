# Supabase SQL Editor Guide for Curapath

This guide shows how to use the Supabase SQL Editor to set up and maintain your database for the Curapath application.

## Accessing the SQL Editor

1. Log in to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query" to create a new SQL script

## Setting Up the Database Schema

### Step 1: Create the UUID Extension

First, run this query to enable the UUID extension (required for generating unique IDs):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Create the Follow-ups Table

Run this query to create the follow-ups table:

```sql
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
```

### Step 3: Create Indexes for Performance

Run these queries to create indexes for faster performance:

```sql
CREATE INDEX IF NOT EXISTS follow_ups_patient_id_idx ON follow_ups(patient_id);
CREATE INDEX IF NOT EXISTS follow_ups_date_idx ON follow_ups(follow_up_date);
```

### Step A: Create an Updated Timestamp Function

This creates a function to automatically update the "updated_at" timestamp:

```sql
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
```

### Step 5: Create Helper Functions

These functions make working with follow-ups easier:

```sql
-- Get upcoming follow-ups
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

-- Mark overdue follow-ups as completed
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
```

### Step 6: Enable Row Level Security

Secure your data with Row Level Security:

```sql
-- Enable RLS
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY select_follow_ups ON follow_ups
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY insert_follow_ups ON follow_ups
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY update_follow_ups ON follow_ups
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY delete_follow_ups ON follow_ups
FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 7: Insert Sample Data (Optional)

For testing, you can insert sample data:

```sql
INSERT INTO follow_ups (patient_id, description, follow_up_date, follow_up_type)
VALUES 
  ('1', 'Schedule follow-up appointment with Dr. Smith', CURRENT_DATE + INTERVAL '7 days', 'appointment'),
  ('1', 'Call patient to check on medication side effects', CURRENT_DATE + INTERVAL '3 days', 'call'),
  ('1', 'Send lab test results via secure message', CURRENT_DATE + INTERVAL '1 day', 'message');
```

## Using the Supabase Dashboard

Aside from the SQL Editor, you can also:

1. View and edit data through the **Table Editor** 
2. Manage user authentication through the **Authentication** section
3. Monitor API usage in the **API** section
4. View SQL logs in the **Logs** section

## Troubleshooting

### Getting Error "relation does not exist"

If you get this error, it means the table doesn't exist yet. Make sure to run the CREATE TABLE query first.

### RLS Blocking Access

If you can't access data, check your RLS policies or temporarily disable RLS for testing:

```sql
ALTER TABLE follow_ups DISABLE ROW LEVEL SECURITY;
```

### Seeing "uuid_generate_v4 is not a function"

Make sure you've run the CREATE EXTENSION command for uuid-ossp.

## Making Database Changes

When making schema changes:

1. Create a new SQL script in the editor
2. Test changes on development/staging first 
3. Document all schema changes for future reference
4. Backup data before making significant changes 