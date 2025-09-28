//review // rating // createdAt //refrecne to toure/ref to user

const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'rating is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Tours is required '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
reviewSchema.index({tour:1,user:1},{unique:true})

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path:'tour',
  //   select:'name'
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
 if(stats.length>0){
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
 }else{
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: 0,
    ratingsAverage: 4.5,
  });
 }
 
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

//findIdandUpdate
//findbyIdandDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Clone the query to avoid double execution
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // After update or delete, recalc ratings
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
