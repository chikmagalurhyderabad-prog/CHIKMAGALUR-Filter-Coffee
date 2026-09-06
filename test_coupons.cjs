const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.join('=').trim();
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseAnonKey = envVars['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCoupons() {
  console.log('Testing Coupons Table...');

  const { data, error } = await supabase.from('coupons').select('*');
  
  if (error) {
    console.error('❌ Error fetching coupons:', error.message);
  } else {
    console.log('✅ Successfully fetched coupons. Found:', data.length);
    console.log(data);
  }
}

testCoupons();
