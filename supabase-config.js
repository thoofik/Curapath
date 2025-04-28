// Supabase configuration
const SUPABASE_URL = 'https://ukhcijajjrxcjrgmqjnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraGNpamFqanJ4Y2pyZ21xam5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTYzMjksImV4cCI6MjA1ODYzMjMyOX0.bV_MOD7v1xJK95Ltw5qOgjTlTpYo8p7FCkilPOUHlhI';

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY };
} else {
  // ES modules
  export { SUPABASE_URL, SUPABASE_ANON_KEY };
} 