/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      if (type === 'data') {
        const user = res.data.data.user;

        // Update profile photo in settings form
        const userPhotoEl = document.querySelector('.form__user-photo');
        if (userPhotoEl && user.photo) {
          userPhotoEl.src = `/img/users/${user.photo}?${Date.now()}`;
        }

        // Update navigation photo
        const navPhotoEl = document.querySelector('.nav__user-img');
        if (navPhotoEl && user.photo) {
          navPhotoEl.src = `/img/users/${user.photo}?${Date.now()}`;
        }

        // Clear the file input
        const photoInput = document.getElementById('photo');
        if (photoInput) {
          photoInput.value = '';
        }
      }
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};
