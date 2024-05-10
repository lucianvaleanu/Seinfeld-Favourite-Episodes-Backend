class EpisodesService {
    constructor(episodesRepository) {
        this.episodesRepository = episodesRepository;
    }

    transformString(input) {
        let transformedString = input.trim().replace(/-+/g, ' ').toLowerCase();
        return transformedString;
    }

    async getAllEpisodes() {
        return await this.episodesRepository.getAllEpisodes();
    }

    async getLength() {
        return await this.episodesRepository.getEpisodeCount();
    }

    async getEpisodeByID(id) {
        id = Number(id);
        const episode = await this.episodesRepository.getEpisodeByID(id);
        if (!episode) {
            throw new Error(`Episode not found with ID ${id}`);
        }
        return episode;
    }

    async getEpisodeByTitle(title) {
        const transformedTitle = this.transformString(title);
        const episode = await this.episodesRepository.getEpisodeByTitle(transformedTitle);
        if (!episode) {
            throw new Error("Could not find episode")
        }
        return episode;
    }

    async getEpisodesByPage(pageNumber, pageSize) {
        pageNumber = Number(pageNumber);
        pageSize = Number(pageSize);

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber <= 0 || pageSize <= 0) {
            throw new Error('Invalid page number or page size');
        }

        const offset = (pageNumber - 1) * pageSize;

        return this.episodesRepository.getEpisodesByPage(pageSize, offset);
    }

    async getSortedEpisodes() {
        return this.episodesRepository.getEpisodesSortedByTitle();
    }

    async getEpisodesBySeason(season) {
        season = Number(season);
        return this.episodesRepository.getEpisodesBySeason(season);
    }

    async getEpisodesByRating(rating) {
        rating = Number(rating);
        return this.episodesRepository.getEpisodesByRating(rating);
    }

    async searchEpisodesByTitle(title) {
        const transformedTitle = this.transformString(title);
        return this.episodesRepository.searchEpisodesByTitle(transformedTitle);
    }

    async getPieChartData() {
        return this.episodesRepository.getSeasonCounts();
    }

    async addEpisode(title, season, episode_number, rating) {
        const transformedTitle = this.transformString(title);
        const existingEpisode = await this.episodesRepository.getEpisodeByTitle(transformedTitle);
        if (existingEpisode) {
            throw new Error(`An episode with the title '${title}' already exists`);
        }
        season = Number(season);
        episode_number = Number(episode_number);
        rating = Number(rating);

        const image = "../assets/default.jpg";
        const newEpisode = { title: title, season, episode_number, rating, image };

        const addedEpisode = await this.episodesRepository.addEpisode(newEpisode);
        return addedEpisode;
    }

    async updateEpisode(id, newTitle, newSeason, newEpisodeNumber, newRating) {
        id = Number(id);
        newSeason = Number(newSeason);
        newEpisodeNumber = Number(newEpisodeNumber);
        newRating = Number(newRating);
        const episodeToUpdate = await this.getEpisodeByID(id);
        if (newTitle && newTitle !== episodeToUpdate.title) {
            const transformedNewTitle = this.transformString(newTitle);
            const existingEpisodeWithSameTitle = await this.episodesRepository.getEpisodeByTitle(transformedNewTitle);

            if (existingEpisodeWithSameTitle && existingEpisodeWithSameTitle.id !== id) {
                throw new Error(`An episode with the title '${newTitle}' already exists`);
            }
        }

        const updatedEpisode = {
            id,
            title: newTitle ? newTitle : episodeToUpdate.title,
            season: newSeason ? newSeason : episodeToUpdate.season,
            episode_number: newEpisodeNumber ? newEpisodeNumber : episodeToUpdate.episode_number,
            rating: newRating ? newRating : episodeToUpdate.rating,
            image: episodeToUpdate.image
        };
        const result = await this.episodesRepository.updateEpisode(updatedEpisode);

        return result;
    }

    async deleteEpisodeByID(id) {
        id = Number(id);
        const success = await this.episodesRepository.deleteEpisodeByID(id);
        if (!success) {
            throw new Error(`Episode not found with ID ${id}`);
        }
    }

    async deleteEpisodeByTitle(title) {
        const episodeToDelete = await this.episodesRepository.getEpisodeByTitle(this.transformString(title));
        if (!episodeToDelete){
            throw new Error(`Episode not found with title ${title}`);
        }
        await this.episodesRepository.deleteEpisodeByTitle(this.transformString(title));
    }
}

module.exports = EpisodesService;
