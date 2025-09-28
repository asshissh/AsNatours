/* eslint-disable */
/**
 * STANDALONE BOOKING SCRIPT
 * This bypasses the bundle entirely and should always work
 */

console.log('🚀 STANDALONE booking script loaded!');

// Wait for everything to be ready
function initStandaloneBooking() {
  console.log('🔍 STANDALONE: Looking for booking button...');
  
  const bookBtn = document.getElementById('book-tour');
  
  if (!bookBtn) {
    console.log('❌ STANDALONE: No booking button found');
    return false;
  }
  
  console.log('✅ STANDALONE: Found booking button');
  console.log('Tour ID:', bookBtn.dataset.tourId);
  
  // Check if already has handler
  if (bookBtn.onclick) {
    console.log('ℹ️ STANDALONE: Button already has handler');
    return true;
  }
  
  // Add the booking functionality
  bookBtn.onclick = async function(e) {
    e.preventDefault();
    console.log('🎯 STANDALONE BOOKING TRIGGERED!');
    
    const tourId = this.dataset.tourId;
    console.log('Tour ID:', tourId);
    
    if (!tourId) {
      alert('No tour ID found!');
      return;
    }
    
    // Show loading
    const originalText = this.textContent;
    this.textContent = 'Processing...';
    this.disabled = true;
    
    try {
      console.log('📡 STANDALONE: Making API call...');
      
      const response = await fetch(`/api/v1/booking/checkout-session/${tourId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('✅ STANDALONE: Got session:', data.session?.id);
      
      if (data.status === 'success' && data.session && data.session.id) {
        console.log('🎯 STANDALONE: Redirecting to Stripe...');
        
        // Check if Stripe is loaded
        if (typeof Stripe === 'undefined') {
          throw new Error('Stripe not loaded');
        }
        
        const stripe = Stripe('pk_test_51S7VTkIzfSrI1uRsKz5vMB5M2efDrjFtPPIqlfc4lp8F11sHjliViQuUDYriYafft7xUI5u1wbh0jVbay9YgN2w900dB0BaYxQ');
        const result = await stripe.redirectToCheckout({
          sessionId: data.session.id
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error(data.message || 'Failed to create checkout session');
      }
      
    } catch (error) {
      console.error('❌ STANDALONE: Booking failed:', error);
      this.textContent = originalText;
      this.disabled = false;
      alert('Booking failed: ' + error.message);
    }
  };
  
  console.log('✅ STANDALONE: Booking button is ready!');
  return true;
}

// Try multiple times to ensure it works
console.log('🔄 STANDALONE: Starting setup attempts...');

// Attempt 1: Immediate
if (!initStandaloneBooking()) {
  console.log('🔄 STANDALONE: Retry in 200ms...');
  
  // Attempt 2: After 200ms
  setTimeout(() => {
    if (!initStandaloneBooking()) {
      console.log('🔄 STANDALONE: Retry in 1000ms...');
      
      // Attempt 3: After 1 second
      setTimeout(() => {
        if (!initStandaloneBooking()) {
          console.log('🔄 STANDALONE: Final retry in 3000ms...');
          
          // Attempt 4: Final attempt after 3 seconds
          setTimeout(() => {
            initStandaloneBooking();
          }, 3000);
        }
      }, 1000);
    }
  }, 200);
}

// Also try when window loads
window.addEventListener('load', () => {
  console.log('📋 STANDALONE: Window loaded, trying setup...');
  initStandaloneBooking();
});

// Make available for manual testing
window.initStandaloneBooking = initStandaloneBooking;

console.log('✅ STANDALONE booking system initialized!');