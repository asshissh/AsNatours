const Wishlist = require('../models/wishlistModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Add tour to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;

  // Check if tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  try {
    // Try to create wishlist entry
    const wishlistItem = await Wishlist.create({
      user: userId,
      tour: tourId
    });

    res.status(201).json({
      status: 'success',
      message: 'Tour added to wishlist!',
      data: {
        wishlistItem
      }
    });
  } catch (err) {
    // Handle duplicate entry (tour already in wishlist)
    if (err.code === 11000) {
      return res.status(200).json({
        status: 'success',
        message: 'Tour is already in your wishlist!'
      });
    }
    return next(err);
  }
});

// Remove tour from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;

  const wishlistItem = await Wishlist.findOneAndDelete({
    user: userId,
    tour: tourId
  });

  if (!wishlistItem) {
    return next(new AppError('Tour not found in your wishlist', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tour removed from wishlist!'
  });
});

// Get user's wishlist
exports.getMyWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const wishlist = await Wishlist.find({ user: userId }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: wishlist.length,
    data: {
      wishlist
    }
  });
});

// Check if tour is in user's wishlist
exports.checkWishlistStatus = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;

  const wishlistItem = await Wishlist.findOne({
    user: userId,
    tour: tourId
  });

  res.status(200).json({
    status: 'success',
    data: {
      inWishlist: !!wishlistItem
    }
  });
});

// Get wishlist with tour details for rendering pages
exports.getWishlistWithTours = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const wishlist = await Wishlist.find({ user: userId })
    .populate({
      path: 'tour',
      select: 'name summary imageCover price difficulty duration ratingsAverage slug startLocation'
    })
    .sort('-createdAt');

  // Extract just the tours for easier template rendering
  const tours = wishlist.map(item => item.tour);

  // Pass to next middleware or render template
  req.wishlistTours = tours;
  next();
});