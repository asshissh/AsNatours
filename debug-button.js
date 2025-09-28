/* eslint-disable */
/**
 * Advanced Button Debug Script
 * Run this in the browser console to diagnose button issues
 */

console.log('🔧 Advanced Button Diagnostics...');

// 1. Check button existence and properties
const checkButton = () => {
  console.log('\n📋 Button Analysis:');
  
  const bookBtn = document.getElementById('book-tour');
  console.log('- Button element:', bookBtn);
  
  if (bookBtn) {
    console.log('- Button ID:', bookBtn.id);
    console.log('- Tour ID from data:', bookBtn.dataset.tourId);
    console.log('- Button classes:', bookBtn.className);
    console.log('- Button text:', bookBtn.textContent);
    console.log('- Button disabled:', bookBtn.disabled);
    console.log('- Button style display:', getComputedStyle(bookBtn).display);
    console.log('- Button style visibility:', getComputedStyle(bookBtn).visibility);
    
    // Check event listeners
    const listeners = getEventListeners ? getEventListeners(bookBtn) : 'getEventListeners not available';
    console.log('- Event listeners:', listeners);
    
    return bookBtn;
  } else {
    console.log('❌ Button not found!');
    
    // Check for alternative selectors
    const alternatives = [
      document.querySelector('.btn--green'),
      document.querySelector('[data-tour-id]'),
      document.querySelector('button[id*="book"]'),
      document.querySelector('button[class*="book"]')
    ];
    
    console.log('- Alternative buttons found:', alternatives.filter(Boolean));
    return null;
  }
};

// 2. Check user authentication
const checkUserAuth = () => {
  console.log('\n🔐 User Authentication:');
  
  const userElement = document.querySelector('.nav__user');
  const loginLink = document.querySelector('a[href="/login"]');
  const bookButton = document.getElementById('book-tour');
  const loginToBookButton = document.querySelector('a[href="/login"].btn--green');
  
  console.log('- User nav element:', !!userElement);
  console.log('- Login link in nav:', !!loginLink);
  console.log('- Book button visible:', !!bookButton);
  console.log('- "Login to book" button:', !!loginToBookButton);
  
  if (bookButton) {
    console.log('✅ User is logged in');
    return true;
  } else if (loginToBookButton) {
    console.log('❌ User not logged in - "Log in to book tour" button found');
    return false;
  } else {
    console.log('⚠️ Cannot determine auth status');
    return null;
  }
};

// 3. Check bundle.js loading and execution
const checkBundleExecution = () => {
  console.log('\n📦 Bundle.js Check:');
  
  // Check if our debug functions are available
  console.log('- debugBooking function:', typeof window.debugBooking);
  console.log('- testBooking function:', typeof window.testBooking);
  
  // Check bundle.js script tag
  const bundleScript = document.querySelector('script[src*="bundle.js"]');
  console.log('- Bundle script tag:', !!bundleScript);
  
  if (bundleScript) {
    console.log('- Bundle src:', bundleScript.src);
    console.log('- Bundle loaded:', bundleScript.complete !== false);
  }
  
  // Check for any JavaScript errors that might have prevented execution
  console.log('- Check console for any JavaScript errors above this line');
};

// 4. Simulate button click with detailed logging
const simulateButtonClick = async () => {
  console.log('\n🎯 Simulating Button Click:');
  
  const bookBtn = document.getElementById('book-tour');
  if (!bookBtn) {
    console.log('❌ No button to click');
    return;
  }
  
  console.log('📍 Button found, attempting click...');
  
  // Check if button has click event listener
  try {
    // Dispatch a click event
    console.log('🖱️ Dispatching click event...');
    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    const dispatched = bookBtn.dispatchEvent(clickEvent);
    console.log('- Event dispatched:', dispatched);
    
    // Also try direct click
    console.log('🖱️ Direct click...');
    bookBtn.click();
    
    console.log('✅ Click attempted - check for any booking process messages');
    
  } catch (error) {
    console.error('❌ Error clicking button:', error);
  }
};

// 5. Manual booking test
const manualBookingTest = async () => {
  console.log('\n🧪 Manual Booking Test:');
  
  const bookBtn = document.getElementById('book-tour');
  if (!bookBtn) {
    console.log('❌ No book button found');
    return;
  }
  
  const tourId = bookBtn.dataset.tourId;
  if (!tourId) {
    console.log('❌ No tour ID found');
    return;
  }
  
  console.log('📋 Tour ID:', tourId);
  console.log('🚀 Starting manual booking process...');
  
  try {
    // Check if bookTour function is available
    if (typeof window.bookTour === 'function') {
      console.log('✅ bookTour function found, calling it...');
      await window.bookTour(tourId);
    } else {
      console.log('❌ bookTour function not found in window object');
      console.log('Available functions:', Object.keys(window).filter(key => key.includes('book')));
    }
  } catch (error) {
    console.error('❌ Manual booking error:', error);
  }
};

// 6. Check for JavaScript errors
const checkForErrors = () => {
  console.log('\n⚠️ Error Check:');
  console.log('If you see any red error messages above this point, that could be preventing the button from working.');
  console.log('Common issues:');
  console.log('- "Cannot read property of undefined"');
  console.log('- "bookTour is not defined"');
  console.log('- "Stripe is not defined"');
  console.log('- CSP violations (usually not critical)');
};

// Run all diagnostics
const runFullDiagnostics = async () => {
  console.log('🔍 FULL BUTTON DIAGNOSTICS');
  console.log('=' .repeat(50));
  
  const button = checkButton();
  const isLoggedIn = checkUserAuth();
  checkBundleExecution();
  checkForErrors();
  
  if (button && isLoggedIn) {
    console.log('\n🎯 Everything looks good, testing click...');
    await simulateButtonClick();
    
    // Wait a moment then try manual booking
    setTimeout(async () => {
      await manualBookingTest();
    }, 1000);
  } else {
    if (!isLoggedIn) {
      console.log('\n❌ ISSUE: User not logged in');
    }
    if (!button) {
      console.log('\n❌ ISSUE: Button not found');
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY:');
  console.log('- Button exists:', !!button);
  console.log('- User logged in:', isLoggedIn);
  console.log('- Ready for booking:', !!(button && isLoggedIn));
};

// Make functions available globally
window.checkButton = checkButton;
window.simulateButtonClick = simulateButtonClick;
window.manualBookingTest = manualBookingTest;

// Auto-run diagnostics
runFullDiagnostics();