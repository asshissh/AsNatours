const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// All routes require authentication
router.use(authControllers.protect);

// API routes for wishlist operations
router.post('/add/:tourId', wishlistController.addToWishlist);
router.delete('/remove/:tourId', wishlistController.removeFromWishlist);
router.get('/check/:tourId', wishlistController.checkWishlistStatus);
router.get('/', wishlistController.getMyWishlist);

module.exports = router;