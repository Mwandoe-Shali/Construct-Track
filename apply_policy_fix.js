const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://efzrbpfcigbdzimrpfnl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenJicGZjaWdiZHppbXJwZm5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTEzMTIzMiwiZXhwIjoyMDUwNzA3MjMyfQ.SQjvC2T5POYz0pxqJ5McP5nN8tdRiqU2sAreZvSgdeY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyPolicyFixes() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./supabase/migrations/20250103000000_fix_profile_policies.sql', 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error applying policy fixes:', error);
      return;
    }
    
    console.log('Policy fixes applied successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

applyPolicyFixes(); 