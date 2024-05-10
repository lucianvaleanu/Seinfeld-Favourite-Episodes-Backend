class ReviewsService {
  constructor(reviewsRepository) {
    this.reviewsRepository = reviewsRepository;
  }

  transformString(input) {
    let transformedString = input.trim().replace(/-+/g, " ").toLowerCase();
    return transformedString;
  }

  async getAllReviews() {
    return await this.reviewsRepository.getAllReviews();
  }

  async getLength(){
    return await this.reviewsRepository.getLength();
  }

  async getReviewsByEpisode(episodeID) {
    episodeID = Number(episodeID);
    return await this.reviewsRepository.getReviewsByEpisode(episodeID);
  }

  async getReviewByID(reviewID) {
    reviewID = Number(reviewID);
    const review = await this.reviewsRepository.getReviewByID(reviewID);
    if (!review) {
      throw new Error(`Review not found with ID ${reviewID}`);
    }
    return review;
  }

  async addReview(episodeID, text, title) {
    episodeID = Number(episodeID);
    const existingReview = await this.reviewsRepository.getReviewByEpisodeAndTitle(episodeID, title);

    if (existingReview) {
      throw new Error(`A review with the title '${title}' already exists for this episode`);
    }

    const newReview = await this.reviewsRepository.addReview({ episodeID, text, title });

    return newReview;
  }

  async updateReview(reviewID, episodeID, newText, newTitle) {
    reviewID = Number(reviewID);
    episodeID = Number(episodeID);

    const existingReviewWithSameTitle = await this.reviewsRepository.getReviewByEpisodeAndTitle(episodeID, newTitle);
    if (existingReviewWithSameTitle && existingReviewWithSameTitle.reviewID !== reviewID) {
      throw new Error(`A review with the title '${newTitle}' already exists for this episode`);
    }

    const updatedReview = await this.reviewsRepository.updateReview({ reviewID, episodeID, text: newText, title: newTitle });

    return updatedReview;
  }

  async deleteReviewByID(reviewID) {
    reviewID = Number(reviewID);
    const success = await this.reviewsRepository.deleteReviewByID(reviewID);
    if (!success) {
      throw new Error(`Review not found with ID ${reviewID}`);
    }
  }
}

module.exports = ReviewsService;
