// Test connection to Supabase (ES Module version)
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.mjs';

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  console.log(`URL: ${SUPABASE_URL}`);
  
  try {
    // Test a simple query - get current timestamp
    const { data, error } = await supabase
      .from('_metadata')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      
      // Try another simple query
      console.log('Trying alternate test query...');
      const { data: tableData, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1);
      
      if (tableError) {
        console.error('Error with alternate query:', tableError);
        console.log('Connection test failed. Please check your credentials.');
      } else {
        console.log('Connection successful using alternate method!');
        console.log('Table found:', tableData);
      }
    } else {
      console.log('Connection successful!');
      console.log('Data retrieved:', data);
    }

    // List available tables
    console.log('\nAttempting to list available tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else if (tables.length === 0) {
      console.log('No tables found in the public schema');
    } else {
      console.log('Available tables:');
      tables.forEach(table => console.log(`- ${table.table_name}`));
    }
    
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
  }
}

testConnection(); 