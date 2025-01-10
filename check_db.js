const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://efzrbpfcigbdzimrpfnl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenJicGZjaWdiZHppbXJwZm5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTEzMTIzMiwiZXhwIjoyMDUwNzA3MjMyfQ.SQjvC2T5POYz0pxqJ5McP5nN8tdRiqU2sAreZvSgdeY'
)

async function checkDatabase() {
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
  
  if (profilesError) {
    console.error('Profiles table error:', profilesError)
  } else {
    console.log('Profiles:', profiles)
  }

  // Check RLS policies
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_policies')
  
  if (policiesError) {
    console.error('Error getting policies:', policiesError)
  } else {
    console.log('Policies:', policies)
  }
}

checkDatabase() 