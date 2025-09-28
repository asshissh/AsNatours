/* eslint-disable */
/**
 * Booking Debug Script
 * Run this in the browser console to diagnose booking issues
 */

console.log('🔧 Starting booking diagnostics...');

// 1. Check if required elements exist
const checkDOMElements = () => {
  console.log('\n📋 DOM Elements Check:');
  
  const bookBtn = document.getElementById('book-tour');
  const stripeScript = document.querySelector('script[src*="stripe.com"]');
  const bundleScript = document.querySelector('script[src*="bundle.js"]');
  
  console.log('- Book button:', bookBtn ? '✅ Found' : '❌ Not Found');
  console.log('- Stripe script:', stripeScript ? '✅ Loaded' : '❌ Missing');
  console.log('- Bundle script:', bundleScript ? '✅ Loaded' : '❌ Missing');
  
  if (bookBtn) {
    console.log('- Tour ID:', bookBtn.dataset.tourId || '❌ Missing');
  }
  
  return { bookBtn, stripeScript, bundleScript };
};

// 2. Check if Stripe is available
const checkStripe = () => {
  console.log('\n💳 Stripe Check:');
  console.log('- Stripe global:', typeof Stripe !== 'undefined' ? '✅ Available' : '❌ Not Available');
  
  if (typeof Stripe !== 'undefined') {
    try {
      const testStripe = Stripe('pk_test_51S7VTkIzfSrI1uRsKz5vMB5M2efDrjFtPPIqlfc4lp8F11sHjliViQuUDYriYafft7xUI5u1wbh0jVbay9YgN2w900dB0BaYxQ');
      console.log('- Stripe initialization:', testStripe ? '✅ Success' : '❌ Failed');
      return testStripe;
    } catch (error) {
      console.log('- Stripe initialization:', '❌ Error -', error.message);
    }
  }
  return null;
};

// 3. Test API endpoint
const testBookingAPI = async (tourId) => {
  console.log('\n🌐 API Test:');
  
  if (!tourId) {
    console.log('❌ No tour ID provided');
    return;
  }
  
  try {
    console.log('📡 Making API request...');
    const response = await fetch(`/api/v1/booking/checkout-session/${tourId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('- Status:', response.status);
    console.log('- Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('- Response:', data);
      return data;
    } else {
      const errorData = await response.text();
      console.log('- Error Response:', errorData);
    }
  } catch (error) {
    console.log('- Network Error:', error.message);
  }
};

// 4. Check user authentication
const checkAuth = () => {
  console.log('\n🔐 Authentication Check:');
  
  const userMenuBtn = document.querySelector('.nav__user');
  const loginLink = document.querySelector('a[href="/login"]');
  
  if (userMenuBtn && !loginLink) {
    console.log('✅ User appears to be logged in');
    return true;
  } else if (loginLink) {
    console.log('❌ User not logged in - Login link found');
    return false;
  } else {
    console.log('⚠️ Cannot determine authentication status');
    return null;
  }
};

// Main diagnostic function
const runDiagnostics = async () => {
  const { bookBtn } = checkDOMElements();
  checkStripe();
  checkAuth();
  
  if (bookBtn && bookBtn.dataset.tourId) {
    await testBookingAPI(bookBtn.dataset.tourId);
  }
  
  console.log('\n🎯 To test booking manually, run: testBooking()');
};

// Manual test function
window.testBooking = async () => {
  const bookBtn = document.getElementById('book-tour');
  if (bookBtn) {
    console.log('🧪 Manually triggering booking...');
    bookBtn.click();
  } else {
    console.log('❌ Book button not found');
  }
};

// Run diagnostics
runDiagnostics();