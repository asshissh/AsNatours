const express = require('express');
const viewsController = require('../controllers/viewsControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

// Wishlist page
router.get('/wishlist', authController.protect, viewsController.getWishlistPage);

module.exports = router;
