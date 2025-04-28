# Supabase Setup for Curapath

This guide explains how to set up and use the Supabase connection for Curapath.

## Credentials

The Supabase connection is configured with the following credentials:

- **URL**: https://ukhcijajjrxcjrgmqjnk.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraGNpamFqanJ4Y2pyZ21xam5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTYzMjksImV4cCI6MjA1ODYzMjMyOX0.bV_MOD7v1xJK95Ltw5qOgjTlTpYo8p7FCkilPOUHlhI

These credentials are stored in the `supabase-config.js` file.

## Testing the Connection

To test the connection to Supabase:

```bash
node test-connection.mjs
```

This will attempt to connect to Supabase and display information about available tables.

## Setting Up the Database Schema

To set up the follow-up database schema:

```bash
node upload-schema.mjs
```

This will create the necessary tables, indexes, and functions in your Supabase database.

## Manual Setup (Alternative)

If the automated setup script doesn't work, you can set up the schema manually:

1. Log in to your Supabase dashboard: https://app.supabase.io
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `database/follow_up_schema.sql`
5. Run the script

## Using Supabase in the Frontend

The frontend application is already configured to use Supabase. The connection is set up in:

```
curapath-frontend/src/services/supabaseClient.js
```

The Supabase credentials are stored in:

```
curapath-frontend/src/supabase-config.js
```

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Check that your Supabase project is active
2. Verify that the URL and API key are correct
3. Ensure you have internet connectivity
4. Check for any IP restrictions on your Supabase project

### Schema Setup Issues

If you encounter issues setting up the schema:

1. Try running the SQL statements one by one in the Supabase SQL Editor
2. Check the error messages for specific issues
3. Ensure you have the necessary permissions

### RLS Policies

The schema sets up Row Level Security (RLS) policies that restrict access based on authentication. If you can't access data:

1. Make sure you're authenticated properly
2. Check that the RLS policies are configured correctly
3. For testing, you can temporarily disable RLS with:

```sql
ALTER TABLE follow_ups DISABLE ROW LEVEL SECURITY;
```

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/introducing-javascript-client)
- [Supabase SQL Editor](https://supabase.io/docs/reference/tools/editor) 