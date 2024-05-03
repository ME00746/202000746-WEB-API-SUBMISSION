const reviewController = require('../controllers/reviewsController');
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authmiddleware');

router.post('/review', authenticateJWT, reviewController.postReview);
router.get('/reviews',  reviewController.getReviews);
router.get('/review/:id',  reviewController.getReview);
router.put('/review/:id', authenticateJWT, reviewController.updateReview);
router.delete('/review/:id', authenticateJWT, reviewController.deleteReview);
router.post('/reviews/recipeId/', reviewController.getReviewsByRecipeId);

router.post('/rating', authenticateJWT, reviewController.postRating);
router.get('/ratings',reviewController.getRatings);
router.post('/calculateRating',  reviewController.calculateRating);
router.post('/rating/byId', authenticateJWT, reviewController.getRating);

module.exports = router;
