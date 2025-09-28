/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Add tour to wishlist
export const addToWishlist = async (tourId) => {
  try {
    console.log('💖 Adding tour to wishlist:', tourId);
    
    const res = await axios({
      method: 'POST',
      url: `/api/v1/wishlist/add/${tourId}`,
      withCredentials: true
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      return true;
    }
  } catch (err) {
    console.error('❌ Add to wishlist error:', err);
    
    let message = 'Failed to add to wishlist. Please try again.';
    if (err.response?.status === 401) {
      message = 'Please log in to add tours to your wishlist!';
    } else if (err.response?.data?.message) {
      message = err.response.data.message;
    }
    
    showAlert('error', message);
    return false;
  }
};

// Remove tour from wishlist
export const removeFromWishlist = async (tourId) => {
  try {
    console.log('💔 Removing tour from wishlist:', tourId);
    
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/wishlist/remove/${tourId}`,
      withCredentials: true
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      return true;
    }
  } catch (err) {
    console.error('❌ Remove from wishlist error:', err);
    
    let message = 'Failed to remove from wishlist. Please try again.';
    if (err.response?.data?.message) {
      message = err.response.data.message;
    }
    
    showAlert('error', message);
    return false;
  }
};

// Check if tour is in wishlist
export const checkWishlistStatus = async (tourId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/wishlist/check/${tourId}`,
      withCredentials: true
    });

    if (res.data.status === 'success') {
      return res.data.data.inWishlist;
    }
    return false;
  } catch (err) {
    console.error('❌ Check wishlist status error:', err);
    return false;
  }
};

// Toggle wishlist status
export const toggleWishlist = async (tourId, button) => {
  const isInWishlist = button.classList.contains('wishlist-btn--active');
  
  // Update button state immediately for better UX
  updateWishlistButton(button, !isInWishlist, true);
  
  let success;
  if (isInWishlist) {
    success = await removeFromWishlist(tourId);
  } else {
    success = await addToWishlist(tourId);
  }
  
  // Revert button state if operation failed
  if (!success) {
    updateWishlistButton(button, isInWishlist, false);
  } else {
    updateWishlistButton(button, !isInWishlist, false);
  }
};

// Update button appearance
export const updateWishlistButton = (button, isInWishlist, isLoading) => {
  const icon = button.querySelector('.wishlist-btn__icon');
  const text = button.querySelector('.wishlist-btn__text');
  
  if (isLoading) {
    button.disabled = true;
    if (text) text.textContent = 'Loading...';
    return;
  }
  
  button.disabled = false;
  
  if (isInWishlist) {
    button.classList.add('wishlist-btn--active');
    button.title = 'Remove from Wishlist';
    if (text) text.textContent = 'In Wishlist';
  } else {
    button.classList.remove('wishlist-btn--active');
    button.title = 'Add to Wishlist';
    if (text) text.textContent = 'Add to Wishlist';
  }
};

// Initialize wishlist buttons on page load
export const initWishlistButtons = async () => {
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');

  await Promise.all(
    Array.from(wishlistButtons).map(async (button) => {
      const tourId = button.dataset.tourId;
      if (!tourId) return;

      const isInWishlist = await checkWishlistStatus(tourId);
      updateWishlistButton(button, isInWishlist, false);

      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(tourId, button);
      });
    })
  );

  console.log('✅ Wishlist buttons initialized');
};
// Expose for console/testing
window.toggleWishlist = toggleWishlist;
window.initWishlistButtons = initWishlistButtons;
