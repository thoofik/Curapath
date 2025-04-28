# Curapath Database Setup Guide

This guide explains how to set up the Supabase database for the Curapath application.

## Prerequisites

- A Supabase account and project
- Access to the Supabase dashboard for your project

## Setting Up the Database

### Using the SQL Editor

1. Log in to your Supabase dashboard
2. Navigate to the **SQL Editor** section
3. Click "New Query" to create a new SQL script
4. Copy and paste the contents of the `follow_up_schema.sql` file
5. Run the script to create the database schema

### Schema Details

The `follow_up_schema.sql` file creates:

- **Tables**:
  - `follow_ups`: Stores patient follow-up tasks

- **Indexes**:
  - `follow_ups_patient_id_idx`: For faster patient-based queries
  - `follow_ups_date_idx`: For faster date-based queries

- **Functions**:
  - `update_modified_column()`: Automatically updates timestamps
  - `get_upcoming_follow_ups()`: Retrieves upcoming follow-ups for a patient
  - `mark_all_overdue_as_completed()`: Marks all overdue tasks as completed

- **Views**:
  - `overdue_follow_ups`: Shows all overdue and incomplete follow-ups

- **Row Level Security (RLS)**:
  - Security policies to control data access

## Connecting to the Application

To connect your application to Supabase:

1. In your Supabase project, go to **Settings** > **API**
2. Copy your **URL** and **anon public** key
3. Create a `.env` file in your project root with:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Restart your application to load the environment variables

## Testing the Connection

You can test if your database is properly connected by:

1. Running the application
2. Using the FollowUp management features
3. Checking the Supabase dashboard to see if data is being stored

## Common Issues

### Row Level Security (RLS)

By default, RLS is enabled and will restrict access based on authentication. If you're having trouble accessing data:

1. Check that your authentication is set up correctly
2. Review the RLS policies in the schema
3. For testing, you can temporarily disable RLS with: `ALTER TABLE follow_ups DISABLE ROW LEVEL SECURITY;`

### UUID Function

If you encounter errors about `uuid_generate_v4()`, you need to enable the UUID extension:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Run this command before creating tables.

## Advanced Usage

### Custom SQL Queries

For complex data retrieval, you can create custom SQL functions:

```sql
CREATE OR REPLACE FUNCTION get_follow_ups_by_type(p_patient_id VARCHAR, p_type VARCHAR)
RETURNS SETOF follow_ups AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM follow_ups
  WHERE patient_id = p_patient_id
  AND follow_up_type = p_type
  ORDER BY follow_up_date ASC;
END;
$$ LANGUAGE plpgsql;
```

### Database Maintenance

Regularly review and optimize your database:

- Check for unused indexes
- Monitor query performance
- Back up your data regularly 