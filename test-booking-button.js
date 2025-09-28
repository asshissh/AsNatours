/* eslint-disable */
/**
 * Quick Test Script for Booking Button
 * Run this in the browser console to test if the button works automatically
 */

console.log('🧪 Testing Booking Button...');

// Wait a moment for everything to load
setTimeout(() => {
  const bookBtn = document.getElementById('book-tour');
  
  if (bookBtn) {
    console.log('✅ Book button found:', bookBtn);
    console.log('- Button text:', bookBtn.textContent);
    console.log('- Tour ID:', bookBtn.dataset.tourId);
    console.log('- Button disabled:', bookBtn.disabled);
    
    // Check if event listeners are attached
    const listeners = getEventListeners ? getEventListeners(bookBtn) : 'getEventListeners not available';
    console.log('- Event listeners:', listeners);
    
    console.log('\n🎯 Try clicking the "Book My Tour" button now!');
    console.log('You should see:');
    console.log('  1. 🎯 Book button clicked!');
    console.log('  2. 📋 Tour ID: [tour-id]');
    console.log('  3. 📡 Making API call...');
    console.log('  4. ✅ Session created');
    console.log('  5. 🎯 Redirecting to Stripe...');
    console.log('  6. [Redirect to Stripe Checkout]');
    
  } else {
    console.log('❌ Book button not found');
    console.log('This means either:');
    console.log('1. You\'re not on a tour page');
    console.log('2. You\'re not logged in');
    console.log('3. There\'s an issue with the page');
  }
}, 1000);

console.log('✅ Test script loaded. Check results above in 1 second...');