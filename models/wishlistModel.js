const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Wishlist must belong to a user!']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Wishlist must have a tour!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to prevent duplicate entries
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

// Populate tour details when querying
wishlistSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'tour',
    select: 'name summary imageCover price difficulty duration ratingsAverage slug'
  });
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;