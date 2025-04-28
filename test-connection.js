// Test connection to Supabase
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('./supabase-config');

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  console.log(`URL: ${SUPABASE_URL}`);
  
  try {
    // Attempt to get database version (a simple query that should work)
    const { data, error } = await supabase.rpc('get_version');
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      
      // Try another simple query
      console.log('Trying alternate test query...');
      const { data: tableData, error: tableError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .limit(1);
      
      if (tableError) {
        console.error('Error with alternate query:', tableError);
        console.log('Connection test failed. Please check your credentials.');
      } else {
        console.log('Connection successful using alternate method!');
        console.log('Tables available:', tableData);
      }
    } else {
      console.log('Connection successful!');
      console.log('Database version:', data);
    }

    // List available tables
    console.log('\nAttempting to list available tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Available tables:');
      tables.forEach(table => console.log(`- ${table.table_name}`));
    }
    
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
  }
}

testConnection(); 