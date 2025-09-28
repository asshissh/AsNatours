/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { initWishlistButtons } from './wishlist';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtns = document.querySelectorAll('.nav__el.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour'); // Single button, not multiple

console.log('🔍 DOM Elements Check:');
console.log('- Map box:', !!mapBox);
console.log('- Login form:', !!loginForm);
console.log('- Logout buttons:', logOutBtns.length);
console.log('- Book button:', !!bookBtn);
console.log('- Stripe available:', typeof Stripe !== 'undefined');

// DELEGATION
// 1️⃣ Map
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// 2️⃣ Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// 3️⃣ Logout
if (logOutBtns.length > 0) {
  logOutBtns.forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    })
  );
}

// 4️⃣ Update user data
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) form.append('photo', photoFile);
    updateSettings(form, 'data');
  });
}

// 5️⃣ Update password
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector('.btn--save-password');
    saveBtn.textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    saveBtn.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// 6️⃣ Book tour - AUTO-WORKING VERSION
console.log('🚀 Natours booking system loading...');

// Simple function that will definitely work
function initBookingButton() {
  console.log('🔍 Searching for booking button...');
  
  const btn = document.getElementById('book-tour');
  if (!btn) {
    console.log('❌ No booking button found');
    return false;
  }
  
  console.log('✅ Booking button found!');
  console.log('Tour ID:', btn.dataset.tourId);
  
  // Remove old listeners
  const freshBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(freshBtn, btn);
  
  // Add new listener
  freshBtn.onclick = async function(e) {
    e.preventDefault();
    console.log('🎯 BOOKING STARTED!');
    
    const tourId = this.dataset.tourId;
    if (!tourId) {
      alert('No tour ID found!');
      return;
    }
    
    console.log('Tour ID:', tourId);
    
    // Update button
    const oldText = this.textContent;
    this.textContent = 'Processing...';
    this.disabled = true;
    
    try {
      console.log('📡 Creating checkout session...');
      
      // API call
      const res = await fetch('/api/v1/booking/checkout-session/' + tourId, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.status === 'success' && data.session && data.session.id) {
        console.log('✅ Session ID:', data.session.id);
        console.log('🎯 Redirecting to Stripe...');
        
        // Redirect to Stripe
        const stripe = Stripe('pk_test_51S7VTkIzfSrI1uRsKz5vMB5M2efDrjFtPPIqlfc4lp8F11sHjliViQuUDYriYafft7xUI5u1wbh0jVbay9YgN2w900dB0BaYxQ');
        const result = await stripe.redirectToCheckout({
          sessionId: data.session.id
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error(data.message || 'Failed to create session');
      }
      
    } catch (err) {
      console.error('❌ Booking failed:', err);
      this.textContent = oldText;
      this.disabled = false;
      alert('Booking failed: ' + err.message);
    }
  };
  
  console.log('✅ Booking button ready!');
  return true;
}

// Multiple attempts to ensure it works
console.log('🔄 Starting booking setup...');

// Try immediately
if (!initBookingButton()) {
  console.log('🔄 Retrying in 100ms...');
  setTimeout(() => {
    if (!initBookingButton()) {
      console.log('🔄 Retrying in 500ms...');
      setTimeout(() => {
        if (!initBookingButton()) {
          console.log('🔄 Final attempt in 1000ms...');
          setTimeout(initBookingButton, 1000);
        }
      }, 500);
    }
  }, 100);
}

// Also try when DOM is ready
if (document.readyState !== 'complete') {
  window.addEventListener('load', () => {
    console.log('📋 Window loaded, trying booking setup...');
    initBookingButton();
  });
}

console.log('✅ Booking system initialized!');

// Make available for debugging
window.initBookingButton = initBookingButton;

console.log('✅ All event listeners set up');

// Global debug function for testing
window.debugBooking = () => {
  console.log('🧪 Debug booking function called');
  const btn = document.getElementById('book-tour');
  if (btn) {
    console.log('Button found:', btn);
    console.log('Tour ID:', btn.dataset.tourId);
    btn.click();
  } else {
    console.log('Button not found');
  }
};
document.addEventListener('DOMContentLoaded', () => {
  initWishlistButtons();
});
console.log('📦 Initializing wishlist buttons...');
initWishlistButtons();