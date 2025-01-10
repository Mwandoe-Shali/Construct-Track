import { supabase } from '../lib/supabase';

export async function checkDatabaseSetup() {
  console.log('Checking database setup...');
  
  // Check profiles table structure
  const { data: profileColumns, error: profileError } = await supabase
    .from('profiles')
    .select()
    .limit(1);

  if (profileError) {
    console.error('Profiles table error:', profileError);
  } else {
    console.log('Profiles table exists');
  }

  // Check if any profiles exist
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking profiles:', countError);
  } else {
    console.log('Number of profiles:', count);
  }

  // Check for database triggers
  const { data: triggers, error: triggerError } = await supabase
    .rpc('get_triggers');

  if (triggerError) {
    console.error('Error checking triggers:', triggerError);
  } else {
    console.log('Database triggers:', triggers);
  }
} 