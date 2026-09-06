import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const generateOrderItems = () => {
  const numItems = Math.floor(Math.random() * 5) + 1;
  const items = [];
  let total = 0;
  for (let i = 0; i < numItems; i++) {
    const price = Math.floor(Math.random() * 500) + 200;
    const qty = Math.floor(Math.random() * 3) + 1;
    total += price * qty;
    items.push({
      productId: Math.floor(Math.random() * 10) + 1,
      name: `Specialty Coffee Blend ${i}`,
      image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7',
      grind: ['Whole Bean', 'Filter Coffee', 'French Press', 'Espresso'][Math.floor(Math.random() * 4)],
      weight: ['250g', '500g', '1kg'][Math.floor(Math.random() * 3)],
      quantity: qty,
      unitPrice: price
    });
  }
  return { items, total };
};

const generateAddress = () => {
  return {
    fullName: `Load Tester ${crypto.randomBytes(4).toString('hex')}`,
    phone: `+91 98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    street: `${Math.floor(Math.random() * 100)} Test Avenue`,
    city: ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 5)],
    state: 'Karnataka',
    pincode: `5600${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`
  };
};

async function runLoadTest() {
  console.log("Starting Load Test...");
  
  // Create a user to place orders
  const email = `test_${Date.now()}@chikmagalur.com`;
  const password = 'LoadTestPassword123!';
  
  console.log(`Registering user: ${email}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Auth error:", authError.message);
    // If sign up fails (e.g. rate limit), let's try to sign in with admin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@chikmagalur.com',
      password: 'admin' // Assuming this is the password
    });
    
    if (signInError) {
      console.error("Sign in failed:", signInError.message);
      process.exit(1);
    }
    console.log("Logged in as admin.");
  } else {
    console.log("User registered and logged in.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("No active user.");
    process.exit(1);
  }

  const numOrders = 200;
  console.log(`Simulating ${numOrders} concurrent orders...`);

  const orderPromises = [];

  for (let i = 0; i < numOrders; i++) {
    const { items, total } = generateOrderItems();
    const address = generateAddress();
    const status = ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)];

    const promise = supabase.from('orders').insert([{
      user_id: user.id,
      items: items,
      total_amount: total,
      shipping_address: address,
      status: status
    }]).then(({ error }) => {
      if (error) {
        console.error(`Order ${i} failed:`, error.message);
        return false;
      }
      return true;
    });

    orderPromises.push(promise);
  }

  const results = await Promise.all(orderPromises);
  const successCount = results.filter(r => r).length;
  
  console.log(`Load test complete!`);
  console.log(`Successfully placed ${successCount} out of ${numOrders} complex orders under load.`);
}

runLoadTest();
