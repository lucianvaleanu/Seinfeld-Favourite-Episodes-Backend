const Joi = require('joi');

const episodeSchema = Joi.object({
    title: Joi.string().required(),
    season: Joi.number().integer().positive().required(),
    episode_number: Joi.number().integer().positive().required(),
    rating: Joi.number().min(0).max(10).required()
});

const idSchema = Joi.number().integer().positive().required();

const seasonSchema = Joi.number().integer().positive().required();

const titleSchema = Joi.string().required();

const ratingSchema = Joi.number().min(0).max(10).required();

class EpisodesController {
    constructor(_episodesService) {
        this.episodeService = _episodesService;
    }

    async getAllEpisodes(req, res) {
        try {
            const episodes = await this.episodeService.getAllEpisodes();
            res.status(200).json(episodes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getLength(req, res) {
        try{
            const length = await this.episodeService.getLength();
            res.status(200).json(length);
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    async getSortedEpisodes(req, res) {
        try {
            const episodes = await this.episodeService.getSortedEpisodes();
            res.status(200).json(episodes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEpisodeByID(req, res) {
        const id = req.params.id;
        try {
            await this.validateInput(idSchema, id);
            const episode = await this.episodeService.getEpisodeByID(id);
            res.status(200).json(episode);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEpisodeByTitle(req, res) {
        const title = req.params.title;
        try {
            await this.validateInput(titleSchema, title);
            const episode = await this.episodeService.getEpisodeByTitle(title);
            res.status(200).json(episode);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEpisodesBySeason(req, res) {
        const season = req.params.season;
        try {
            await this.validateInput(seasonSchema, season);
            const filteredEpisodes = await this.episodeService.getEpisodesBySeason(season);
            res.status(200).json(filteredEpisodes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPieChartData(req, res) {
        try{
            const seasonCounts = await this.episodeService.getPieChartData();
            res.status(200).json(seasonCounts);
        } catch(error){
            res.status(400).json({message: error.message});
        }
    }

    async getEpisodesByRating(req, res) {
        const rating = req.params.rating;
        try{
            await this.validateInput(ratingSchema, rating);
            const episodes = await this.episodeService.getEpisodesByRating(rating);
            res.status(200).json(episodes);
        }catch(error){
            res.status(400).json({message: error.message});
        }
    }

    async getEpisodesByPage(req, res) {
        const page = req.params.page;
        const items = req.params.items;
        try{
            const paginatedEpisodes = await this.episodeService.getEpisodesByPage(page,items);
            res.status(200).json(paginatedEpisodes);
        } catch (error){
            res.status(400).json({message: error.message});
        }
    }

    async searchEpisodesByTitle(req, res) {
        const title = req.params.title;
        try {
            await this.validateInput(titleSchema, title);
            const foundEpisodes = await this.episodeService.searchEpisodesByTitle(title);
            res.status(200).json(foundEpisodes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createEpisode(req, res) {
        const { title, season, episode_number, rating } = req.body;
        try {
            await this.validateInput(episodeSchema, { title, season, episode_number, rating });
            const newEpisode = await this.episodeService.addEpisode(title, season, episode_number, rating);
            res.status(201).json({ message: "Episode created successfully", newEpisode });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateEpisode(req, res) {
        const id = req.params.id;
        const { title, season, episode_number, rating } = req.body;
        try {
            await this.validateInput(idSchema, id);
            await this.validateInput(episodeSchema, { title, season, episode_number, rating });
            await this.episodeService.updateEpisode(id, title, season, episode_number, rating);
            res.status(200).json({ message: "Episode updated" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteEpisodeByID(req, res) {
        const id = req.params.id;
        try {
            await this.validateInput(idSchema, id);
            await this.episodeService.deleteEpisodeByID(id);
            res.status(200).json({ message: "Episode deleted successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteEpisodeByTitle(req, res) {
        const title = req.params.title;
        try {
            await this.validateInput(titleSchema, title);
            await this.episodeService.deleteEpisodeByTitle(title);
            res.status(200).json({ message: "Episode deleted successfully!" });
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

module.exports = EpisodesController;
