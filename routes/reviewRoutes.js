const express = require('express');
const reviewController = require('./../controllers/reviewControllers');
const authControllers = require('./../controllers/authControllers');

const router = express.Router({ mergeParams: true });


router.use(authControllers.protect)

router
  .route('/')
  .get(reviewController.gettingAllReview)
  .post(
    authControllers.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authControllers.restrictTo('user','adimin'),reviewController.updateReview)
  .delete(authControllers.restrictTo('user','adimin'),reviewController.deleteReview);

module.exports = router;
