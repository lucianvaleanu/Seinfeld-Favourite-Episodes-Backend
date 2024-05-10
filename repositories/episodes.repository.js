const { Op, Sequelize } = require('sequelize');
const faker = require('faker');

class EpisodesRepository {
    constructor(_episodeModel) {
        this.episodeModel = _episodeModel;
        //this.generateFakeEpisodes();
    }
    async getAllEpisodes() {
        return await this.episodeModel.findAll();
    }

    async getEpisodeCount() {
        const episodeCount = await this.episodeModel.count();
        return episodeCount;
    }

    async getEpisodeByID(id) {
        return await this.episodeModel.findByPk(id);
    }

    async getEpisodeByTitle(inputTitle) {
        const episode = await this.episodeModel.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('title')),
                Sequelize.fn('LOWER', inputTitle)
            )
        });
        return episode;
    }

    async getEpisodesByPage(pageSize, offset) {
        const episodes = await this.episodeModel.findAll({
            order: [['id', 'ASC']],
            limit: pageSize,
            offset: offset
        });

        return episodes;
    }

    async getEpisodesSortedByTitle() {
        const sortedEpisodes = await this.episodeModel.findAll({
            order: [['title', 'ASC']]
        });
        return sortedEpisodes;
    }

    async getEpisodesBySeason(season) {
        const episodes = await this.episodeModel.findAll({
            where: { season: season }
        });
        return episodes;
    }

    async getEpisodesByRating(rating) {
        const episodes = await this.episodeModel.findAll({
            where: { rating: rating }
        });
        return episodes;
    }

    async searchEpisodesByTitle(title) {
        const episodes = await this.episodeModel.findAll({
            where: {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        });
        return episodes;
    }

    async getSeasonCounts() {
        const seasonCounts = await this.episodeModel.findAll({
            attributes: ['season', [this.episodeModel.sequelize.fn('COUNT', this.episodeModel.sequelize.col('*')), 'count']],
            group: ['season']
        });

        const formattedCounts = {};
        seasonCounts.forEach(row => {
            formattedCounts[row.season] = row.get('count');
        });

        return formattedCounts;
    }

    async addEpisode(episode) {
        return await this.episodeModel.create(episode);
    }

    async updateEpisode(episode) {
        const { id, title, season, episode_number, rating, image } = episode;
        const existingEpisode = await this.episodeModel.findByPk(id);
        if (!existingEpisode) {
            throw new Error('Episode not found');
        }
        return await existingEpisode.update({ title, season, episode_number, rating, image });
    }

    async deleteEpisodeByID(id) {
        const episode = await this.episodeModel.findByPk(id);
        if (episode) {
            await episode.destroy();
            return true;
        }
        return false;
    }

    async deleteEpisodeByTitle(title) {
        await this.episodeModel.destroy({ where: { title } });
    }

    async generateFakeEpisodes() {
        try {
            for (let i = 0; i < 10000; i++) {
                const episode = {
                    title: faker.lorem.words(),
                    season: faker.datatype.number({ min: 1, max: 10 }),
                    episode_number: faker.datatype.number({ min: 1, max: 20 }),
                    rating: faker.datatype.number({ min: 1, max: 10 }),
                    image: "../assets/default.jpg"
                };
                await this.addEpisode(episode);
            }
        } catch (error) {
            console.error('Error creating episodes:', error);
        }
    }
}

module.exports = EpisodesRepository;
