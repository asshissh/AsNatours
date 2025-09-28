/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Initialize Stripe
console.log('🔧 Initializing Stripe...');
const stripe = Stripe('pk_test_51S7VTkIzfSrI1uRsKz5vMB5M2efDrjFtPPIqlfc4lp8F11sHjliViQuUDYriYafft7xUI5u1wbh0jVbay9YgN2w900dB0BaYxQ');
console.log('✅ Stripe initialized:', stripe);

export const bookTour = async (tourId) => {
  try {
    console.log('🚀 Starting booking process for tour:', tourId);

    if (!tourId) {
      throw new Error('Tour ID is required');
    }

    // Show loading message
    showAlert('info', 'Creating your booking session...');

    // 1) Get checkout session from API
    console.log('📡 Making API request to get checkout session...');
    
    const res = await axios({
      method: 'GET',
      url: `/api/v1/booking/checkout-session/${tourId}`,
      withCredentials: true, // Important for authentication
    });

    console.log('✅ API Response:', res.data);

    // Check response format
    if (!res.data || res.data.status !== 'success') {
      throw new Error(res.data.message || 'Failed to create checkout session');
    }

    const session = res.data.session;
    
    if (!session || !session.id) {
      console.error('❌ Invalid session object:', session);
      throw new Error('No session ID received from server');
    }

    console.log('🎫 Session ID:', session.id);

    // Show success message
    showAlert('success', 'Redirecting to payment page...');

    // 2) Redirect to Stripe Checkout
    console.log('🔄 Redirecting to Stripe Checkout...');
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    // This code will only run if there's an error
    console.error('❌ Stripe redirect error:', result);
    
    if (result.error) {
      throw new Error(result.error.message);
    }

  } catch (err) {
    console.error('❌ Booking error:', err);

    let message = 'Something went wrong! Please try again.';

    if (err.response) {
      // Server responded with error
      console.log('Server error response:', err.response.data);
      
      if (err.response.status === 401) {
        message = 'You need to log in to book a tour!';
        // Redirect to login after showing error
        setTimeout(() => {
          window.location.assign('/login');
        }, 2000);
      } else if (err.response.status === 404) {
        message = 'Tour not found!';
      } else if (err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
    } else if (err.message.includes('Stripe')) {
      message = `Payment error: ${err.message}`;
    } else if (err.message) {
      message = err.message;
    }

    showAlert('error', message);
    
    // Re-throw error so the button can be reset in the main file
    throw err;
  }
};