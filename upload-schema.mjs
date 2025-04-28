// Script to upload schema to Supabase (ES Module version)
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.mjs';

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read the SQL file
const sqlSchema = fs.readFileSync('./database/follow_up_schema.sql', 'utf8');

// Function to run SQL directly via the Supabase REST API
async function runSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'params=single-object'
    },
    body: JSON.stringify({
      query: sql
    })
  });
  
  return response.json();
}

// Manual execute of each SQL statement
async function executeSchema() {
  // First, enable UUID extension
  console.log('Creating UUID extension...');
  try {
    await runSQL('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('UUID extension created or already exists');
  } catch (error) {
    console.error('Error creating UUID extension:', error);
  }
  
  // Create the follow_ups table
  console.log('Creating follow_ups table...');
  try {
    await runSQL(`
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
    `);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
  
  // Create indexes
  console.log('Creating indexes...');
  try {
    await runSQL('CREATE INDEX IF NOT EXISTS follow_ups_patient_id_idx ON follow_ups(patient_id);');
    await runSQL('CREATE INDEX IF NOT EXISTS follow_ups_date_idx ON follow_ups(follow_up_date);');
    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
  
  // Create trigger function
  console.log('Creating trigger function...');
  try {
    await runSQL(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('Trigger function created successfully');
  } catch (error) {
    console.error('Error creating trigger function:', error);
  }
  
  // Create trigger
  console.log('Creating trigger...');
  try {
    await runSQL(`
      CREATE TRIGGER update_follow_ups_updated_at
      BEFORE UPDATE ON follow_ups
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);
    console.log('Trigger created successfully');
  } catch (error) {
    console.error('Error creating trigger:', error);
  }
  
  // Enable Row Level Security
  console.log('Enabling RLS...');
  try {
    await runSQL('ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;');
    console.log('RLS enabled successfully');
  } catch (error) {
    console.error('Error enabling RLS:', error);
  }
  
  // Create RLS policies
  console.log('Creating RLS policies...');
  try {
    // Select policy
    await runSQL(`
      CREATE POLICY select_follow_ups ON follow_ups
      FOR SELECT USING (auth.role() = 'authenticated');
    `);
    
    // Insert policy
    await runSQL(`
      CREATE POLICY insert_follow_ups ON follow_ups
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    `);
    
    // Update policy
    await runSQL(`
      CREATE POLICY update_follow_ups ON follow_ups
      FOR UPDATE USING (auth.role() = 'authenticated');
    `);
    
    // Delete policy
    await runSQL(`
      CREATE POLICY delete_follow_ups ON follow_ups
      FOR DELETE USING (auth.role() = 'authenticated');
    `);
    
    console.log('RLS policies created successfully');
  } catch (error) {
    console.error('Error creating RLS policies:', error);
  }
  
  console.log('Schema setup complete!');
}

// Run the script
executeSchema(); 