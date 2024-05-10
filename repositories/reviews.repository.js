class ReviewsRepository {
    constructor(_reviewModel) {
        this.reviewModel = _reviewModel;
    }

    async getAllReviews() {
        return await this.reviewModel.findAll();
    }

    async getLength(){
        const length = await this.reviewModel.count();
        return length;
    }


    async getReviewsByEpisode(episodeID) {
        return await this.reviewModel.findAll({ where: { episodeID } });
    }

    async getReviewByID(reviewID) {
        return await this.reviewModel.findByPk(reviewID);
    }

    async getReviewByEpisodeAndTitle(episodeID, title) {
        return await this.reviewModel.findOne({ where: { episodeID, title } });
      }

    async addReview(review) {
        return await this.reviewModel.create(review);
    }

    async updateReview(review) {
        const { reviewID, text, title } = review;
        const existingReview = await this.reviewModel.findByPk(reviewID);
        if (!existingReview) {
            throw new Error('Review not found');
        }
        existingReview.text = text;
        existingReview.title = title;
        return await existingReview.update({text, title});
    }

    async deleteReviewByID(reviewID) {
        const review = await this.reviewModel.findByPk(reviewID);
        if (review) {
            await review.destroy();
            return true;
        }
        return false;
    }

    async deleteReviewByTitle(title) {
        await this.reviewModel.destroy({ where: { title } });
    }
}

module.exports = ReviewsRepository;
