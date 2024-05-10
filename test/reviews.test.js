const { Sequelize, DataTypes } = require('sequelize');

const ReviewsRepository = require('../repositories/reviews.repository');
const ReviewsService = require('../services/reviews.service');

const EpisodesRepository = require('../repositories/episodes.repository');
const EpisodesService = require('../services/episodes.service');

describe('Reviews', () => {
    let sequelize;
    let ReviewModel;
    let reviewsRepository;
    let reviewsService;
    let EpisodeModel;
    let episodesRepository;
    let episodesService;

    beforeEach(async () => {
        sequelize = new Sequelize('sqlite://:memory:', {
            logging: false
        });
        EpisodeModel = sequelize.define('Episode', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            season: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            episode_number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        ReviewModel = sequelize.define('Review', {
            reviewID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            episodeID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: EpisodeModel,
                    key: 'id'
                }
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        ReviewModel.belongsTo(EpisodeModel, { foreignKey: 'episodeID', onDelete: 'CASCADE' });
        await sequelize.sync();
        reviewsRepository = new ReviewsRepository(ReviewModel);
        reviewsService = new ReviewsService(reviewsRepository);
        episodesRepository = new EpisodesRepository(EpisodeModel);
        episodesService = new EpisodesService(episodesRepository);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    describe('getAllReviews', () => {
        it('should return all reviews', async () => {
            let episodes = await reviewsService.getAllReviews();
            expect(episodes.length).toEqual(0);
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            await reviewsService.addReview(episodeID, "review text", "review title");
            expect(await reviewsService.getLength()).toEqual(1);
        });
    });

    describe('getReviewsByEpisode', () => {
        it('should return all reviews for a given episode', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            await reviewsService.addReview(episodeID, "review text", "review title");
            await reviewsService.addReview(episodeID, "review text", "review title2");
            await reviewsService.addReview(episodeID, "review text", "review title3");
            let reviews = await reviewsService.getReviewsByEpisode(episodeID);
            expect(reviews.length).toEqual(3);

            const secondEpisode = await episodesService.addEpisode("title2", 1, 2, 1);
            const secondID = secondEpisode.id;
            await reviewsService.addReview(secondID, "review text", "review title");
            await reviewsService.addReview(secondID, "review text", "review title2");
            reviews = await reviewsService.getReviewsByEpisode(secondID);
            expect(reviews.length).toEqual(2);
        });
    });
    describe('getReviewByID', () => {
        it('should return a review by ID if it exists', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            const addedReview = await ReviewModel.create({
                episodeID: episodeID,
                text: 'review text',
                title: 'review title'
            });

            const reviewID = addedReview.reviewID;

            const retrievedReview = await reviewsService.getReviewByID(reviewID);

            expect(retrievedReview.reviewID).toEqual(addedReview.reviewID);
            expect(retrievedReview.episodeID).toEqual(addedReview.episodeID);
            expect(retrievedReview.text).toEqual(addedReview.text);
            expect(retrievedReview.title).toEqual(addedReview.title);
        });

        it('should throw an error if review with the given ID does not exist', async () => {
            const nonExistentReviewID = 999;
            await expect(reviewsService.getReviewByID(nonExistentReviewID))
                .rejects.toThrowError(`Review not found with ID ${nonExistentReviewID}`);
        });
    });

    describe('addReview', () => {
        it('should successfully add reviews', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            await reviewsService.addReview(episodeID, "review text", "review title");
            await reviewsService.addReview(episodeID, "review text", "review title2");
            await reviewsService.addReview(episodeID, "review text", "review title3");
            expect(await reviewsService.getLength()).toEqual(3);

            const secondEpisode = await episodesService.addEpisode("title2", 1, 2, 1);
            const secondID = secondEpisode.id;
            await reviewsService.addReview(secondID, "review text", "review title");
            await reviewsService.addReview(secondID, "review text", "review title2");
            reviews = await reviewsService.getAllReviews();
            expect(await reviewsService.getLength()).toEqual(5);
        });
        it('should throw an error when adding a review with the same title as another review for the same episode', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            await reviewsService.addReview(episodeID, "review text", "review title");
            expect(await reviewsService.getLength()).toEqual(1);

            const secondEpisode = await episodesService.addEpisode("title2", 1, 2, 1);
            const secondID = secondEpisode.id;

            await reviewsService.addReview(secondID, "review text", "review title");
            reviews = await reviewsService.getAllReviews();
            expect(await reviewsService.getLength()).toEqual(2);

            await expect(reviewsService.addReview(episodeID, "text", "review title")).rejects.toThrowError("A review with the title 'review title' already exists for this episode");
            reviews = await reviewsService.getAllReviews();
            expect(await reviewsService.getLength()).toEqual(2);

        });
    });

    describe('updateReview', () => {
        it('should successfully update a review', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            const review = await reviewsService.addReview(episodeID, "review text", "review title");
            const reviewID = review.reviewID;
            await reviewsService.updateReview(reviewID, episodeID, "new text", "new title");
            const retrievedReview = await reviewsService.getReviewByID(reviewID);
            expect(retrievedReview.text).toEqual("new text");
            expect(retrievedReview.title).toEqual("new title");
        });

        it('should throw an error when updating a review which has the same title as another review for the same episode', async()=>{
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            await reviewsService.addReview(episodeID, "review text", "review title");
            const reviewToUpdate = await reviewsService.addReview(episodeID, "review text 2", "review title 2");
            const reviewID = reviewToUpdate.reviewID;
            await expect(reviewsService.updateReview(reviewID, episodeID, "new text", "review title")).rejects.toThrowError("A review with the title 'review title' already exists for this episode");
        });
    });

    describe('deleteReviewByID', () => {
        it('should delete a review by ID if it exists', async () => {
            const episode = await episodesService.addEpisode("title", 1, 1, 1);
            const episodeID = episode.id;
            const review = await reviewsService.addReview(episodeID, "review text", "review title");
            const reviewID = review.reviewID;
    
            await reviewsService.deleteReviewByID(reviewID);
    
            await expect(reviewsService.getReviewByID(reviewID)).rejects.toThrowError(`Review not found with ID ${reviewID}`);
        });
    
        it('should throw an error when deleting a non-existent review', async () => {
            const nonExistentReviewID = 999;
    
            await expect(reviewsService.deleteReviewByID(nonExistentReviewID))
                .rejects.toThrowError(`Review not found with ID ${nonExistentReviewID}`);
        });
    });
    
});