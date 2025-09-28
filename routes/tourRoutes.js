const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authControllers = require('./../controllers/authControllers');
const reviewRoutes = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoutes);
router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

  router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);

  router.route('/distance/:latlng/unit/:unit').get(tourControllers.getDistances)


// Routes
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour,
  );

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.uploadTourImages,
    tourControllers.resizeTourImages,
    tourControllers.updateTour,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

// router
// .route('/:tourId/reviews')
// .post(
//   authControllers.protect,
//   authControllers.restrictTo('user'),
//   reviewController.createReview,
// );

module.exports = router;
