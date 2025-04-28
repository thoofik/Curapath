// Script to upload schema to Supabase
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('./supabase-config');

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read the SQL file
const sqlSchema = fs.readFileSync('./database/follow_up_schema.sql', 'utf8');

// Split the SQL into individual statements
// This is a simple approach - more complex SQL might need a proper parser
const statements = sqlSchema
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Execute each statement
async function executeSchema() {
  console.log('Starting to execute schema...');
  
  try {
    // Execute extension creation first
    if (statements[0].includes('CREATE EXTENSION')) {
      console.log('Creating extension...');
      const { error } = await supabase.rpc('execute_sql', { 
        sql_query: statements[0] + ';' 
      });
      
      if (error) {
        console.error('Error creating extension:', error);
      } else {
        console.log('Extension created successfully');
      }
    }

    // Execute each statement one by one
    for (let i = 1; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i}/${statements.length-1}...`);
      
      const { error } = await supabase.rpc('execute_sql', { 
        sql_query: statement + ';' 
      });
      
      if (error) {
        console.error(`Error executing statement ${i}:`, error);
        console.error('Statement:', statement);
      } else {
        console.log(`Statement ${i} executed successfully`);
      }
    }
    
    console.log('Schema upload completed!');
  } catch (error) {
    console.error('Error executing schema:', error);
  }
}

// Handle RDBMS function if needed
async function createExecuteSqlFunction() {
  console.log('Creating execute_sql function if it doesn\'t exist...');
  
  try {
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (error && !error.message.includes('function already exists')) {
      console.error('Error creating execute_sql function:', error);
    } else {
      console.log('execute_sql function is ready');
    }
  } catch (error) {
    // If the function doesn't exist yet, we need to create it manually through the dashboard
    console.log('You need to create the execute_sql function manually in the Supabase dashboard');
    console.log('Please go to the SQL Editor and run:');
    console.log(`
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
  }
}

// Run the script
async function run() {
  await createExecuteSqlFunction();
  await executeSchema();
}

run(); 