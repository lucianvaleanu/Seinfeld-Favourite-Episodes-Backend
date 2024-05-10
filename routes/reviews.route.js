const router = require("express").Router();

const ReviewModel = require('../models/review.model');
const ReviewsRepository = require('../repositories/reviews.repository');
const ReviewsService = require('../services/reviews.service');
const ReviewsController = require('../controllers/reviews.controller');

const reviewsController = new ReviewsController(new ReviewsService(new ReviewsRepository(ReviewModel)));

router.get('/', reviewsController.getAllReviews.bind(reviewsController));
router.get('/id/:id', reviewsController.getReviewByID.bind(reviewsController));
router.get('/ep/:id', reviewsController.getReviewsByEpisode.bind(reviewsController))

router.post('/', reviewsController.addReview.bind(reviewsController));

router.put('/id/:id', reviewsController.updateReview.bind(reviewsController));

router.delete('/id/:id', reviewsController.deleteReviewByID.bind(reviewsController));

module.exports = router;

