const Joi = require('joi');

const reviewSchema = Joi.object({
    reviewID: Joi.number().integer().min(1).required(),
    episodeID: Joi.number().integer().min(1).required(),
    text: Joi.string().max(150),
    title: Joi.string().max(50).required()
});

const idSchema = Joi.number().integer().positive().required();
const titleSchema = Joi.string().max(50).required();
const textSchema = Joi.string().max(150).required();

class ReviewsController {
    constructor(_reviewsService) {
        this.reviewsService = _reviewsService;
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await this.reviewsService.getAllReviews();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getReviewsByEpisode(req, res) {
        const episodeID = req.params.id;
        try {
            this.validateInput(idSchema, episodeID);
            const reviews = await this.reviewsService.getReviewsByEpisode(episodeID);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getReviewByID(req, res) {
        const reviewID = req.params.id;
        try {
            this.validateInput(idSchema, reviewID);
            const reviews = await this.reviewsService.getReviewByID(reviewID);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addReview(req, res) {
        const { episodeID, text, title } = req.body;
        try {
            await this.validateInput(titleSchema, title);
            await this.validateInput(idSchema, episodeID);
            await this.validateInput(textSchema, text);
            const newReview = await this.reviewsService.addReview(episodeID, text, title);
            res.status(201).json({ message: "Review added successfully!", newReview });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateReview(req, res) {
        const { reviewID, episodeID, text, title } = req.body;
        try {
            await this.validateInput(reviewSchema, { reviewID, episodeID, text, title });
            await this.reviewsService.updateReview(reviewID, episodeID, text, title);
            res.status(200).json({ message: "Review updated" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReviewByID(req, res){
        const reviewID = req.params.id;
        try{
            await this.validateInput(idSchema, reviewID);
            await this.reviewsService.deleteReviewByID(reviewID);
            res.status(200).json({ message: "Review deleted successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async validateInput(schema, data) {
        const { error } = await schema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
    }
}

module.exports = ReviewsController;
