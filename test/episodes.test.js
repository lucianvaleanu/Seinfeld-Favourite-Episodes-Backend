const { Sequelize, DataTypes } = require('sequelize');
const EpisodesRepository = require('../repositories/episodes.repository');
const EpisodesService = require('../services/episodes.service');

describe('Episodes', () => {
    let sequelize;
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

        await sequelize.sync();
        episodesRepository = new EpisodesRepository(EpisodeModel);
        episodesService = new EpisodesService(episodesRepository);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    describe('getAllEpisodes', () => {
        it('should return all episodes', async () => {
            let episodes = await episodesService.getAllEpisodes();
            expect(episodes.length).toEqual(0);
            await episodesService.addEpisode("title", 1, 1, 1);
            episodes = await episodesService.getAllEpisodes();
            expect(episodes.length).toEqual(1);
        });
    });

    describe('getLength', () => {
        it('should return the correct length after each add and delete', async () => {
            let length = await episodesService.getLength();
            expect(length).toEqual(0);
            await episodesService.addEpisode("title", 1, 1, 1);
            length = await episodesService.getLength();
            expect(length).toEqual(1);
            await episodesService.addEpisode("title2", 1, 1, 1);
            length = await episodesService.getLength();
            expect(length).toEqual(2);
            await episodesService.deleteEpisodeByTitle("title2");
            length = await episodesService.getLength();
            expect(length).toEqual(1);
            await episodesService.deleteEpisodeByTitle("title");
            length = await episodesService.getLength();
            expect(length).toEqual(0);
        });
    });

    describe('getEpisodeByTitle', () => {
        it('should return the correct episode given the title', async () => {
            await episodesService.addEpisode("The New Episode", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            let episode = await episodesService.getEpisodeByTitle("The New Episode");
            expect(episode.title).toEqual("The New Episode");
            episode = await episodesService.getEpisodeByTitle("the-new-episode");
            expect(episode.title).toEqual("The New Episode");
        });
        it('should throw an error if the given title does not exist', async () => {
            const nonExistentTitle = "Non-Existent Episode";
            await expect(episodesService.getEpisodeByTitle(nonExistentTitle)).rejects.toThrowError("Could not find episode");
        });
    });

    describe('getEpisodesByPage', () => {
        it('should return episodes based on page number and page size', async () => {
            await episodesService.addEpisode("title1", 1, 1, 8);
            await episodesService.addEpisode("title2", 1, 2, 7);
            await episodesService.addEpisode("title3", 1, 3, 9);

            const pageSize = 2;
            const pageNumber = 1;

            const episodes = await episodesService.getEpisodesByPage(pageNumber, pageSize);

            expect(episodes.length).toEqual(2);
            expect(episodes[0].title).toEqual("title1");
            expect(episodes[1].title).toEqual("title2");
        });

        it('should throw an error for invalid page number or page size', async () => {
            const invalidPageSize = 0;
            const invalidPageNumber = -1;

            await expect(episodesService.getEpisodesByPage(invalidPageNumber, invalidPageSize)).rejects.toThrowError('Invalid page number or page size');
        });
    });

    describe('getSortedEpisodes', () => {
        it('should return episodes sorted by title in ascending order', async () => {
            await episodesService.addEpisode("C", 1, 1, 8);
            await episodesService.addEpisode("A", 1, 2, 7);
            await episodesService.addEpisode("B", 1, 3, 9);

            const sortedEpisodes = await episodesService.getSortedEpisodes();

            expect(sortedEpisodes.length).toEqual(3);
            expect(sortedEpisodes[0].title).toEqual("A");
            expect(sortedEpisodes[1].title).toEqual("B");
            expect(sortedEpisodes[2].title).toEqual("C");
        });
    });

    describe('getEpisodesBySeason', () => {
        it('should return episodes for a specific season', async () => {
            await episodesService.addEpisode("s1e1", 1, 1, 8);
            await episodesService.addEpisode("s1e2", 1, 2, 7);
            await episodesService.addEpisode("s2e1", 2, 1, 9);

            const season1Episodes = await episodesService.getEpisodesBySeason(1);

            expect(season1Episodes.length).toEqual(2);
            expect(season1Episodes[0].season).toEqual(1);
            expect(season1Episodes[1].season).toEqual(1);

            const season2Episodes = await episodesService.getEpisodesBySeason(2);

            expect(season2Episodes.length).toEqual(1);
            expect(season2Episodes[0].season).toEqual(2);

        });
    });

    describe('getEpisodesByRating', () => {
        it('should return episodes for a specific rating', async () => {
            await episodesService.addEpisode("title1", 1, 1, 9);
            await episodesService.addEpisode("title2", 1, 2, 5);
            await episodesService.addEpisode("title3", 1, 3, 7);

            const highRatedEpisodes = await episodesService.getEpisodesByRating(9);

            expect(highRatedEpisodes.length).toEqual(1);
            expect(highRatedEpisodes[0].title).toEqual("title1");
        });
    });

    describe('searchEpisodesByTitle', () => {
        it('should return episodes matching the search title', async () => {
            await episodesService.addEpisode("Search Keyword", 1, 1, 8);
            await episodesService.addEpisode("Another Episode", 1, 2, 7);
            await episodesService.addEpisode("Keyword Episode", 1, 3, 9);

            const searchResults = await episodesService.searchEpisodesByTitle("keyword");

            expect(searchResults.length).toEqual(2);
            expect(searchResults[0].title).toContain("Keyword");
            expect(searchResults[1].title).toContain("Keyword");
        });
    });

    describe('getPieChartData', () => {
        it('should return formatted pie chart data based on season counts', async () => {

            await episodesService.addEpisode("a", 1, 1, 1);
            await episodesService.addEpisode("b", 1, 1, 1);
            await episodesService.addEpisode("c", 1, 1, 1);
            await episodesService.addEpisode("d", 1, 1, 1);
            await episodesService.addEpisode("e", 1, 1, 1);

            await episodesService.addEpisode("aa", 2, 1, 1);
            await episodesService.addEpisode("bb", 2, 1, 1);
            await episodesService.addEpisode("cc", 2, 1, 1);

            await episodesService.addEpisode("aaa", 3, 1, 1);
            await episodesService.addEpisode("bbb", 3, 1, 1);
            await episodesService.addEpisode("ccc", 3, 1, 1);
            await episodesService.addEpisode("ddd", 3, 1, 1);
            await episodesService.addEpisode("eee", 3, 1, 1);
            await episodesService.addEpisode("fff", 3, 1, 1);

            const pieChartData = await episodesService.getPieChartData();

            expect(pieChartData).toEqual({
                1: 5,
                2: 3,
                3: 6
            });
        });
    });
    describe('addEpisode', () => {
        it('should add episodes successfully', async () => {
            await episodesService.addEpisode("title", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            await episodesService.addEpisode("title2", 1, 1, 1);
            await episodesService.addEpisode("title3", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(3);
        });
        it('should throw an error if an episode with the same title already exists', async () => {
            await episodesService.addEpisode("The Episode", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            await expect(episodesService.addEpisode("The Episode", 1, 1, 1)).rejects.toThrowError("An episode with the title 'The Episode' already exists");
        });
    });

    describe('updateEpisode', () => {
        it('should update an episode successfully', async () => {
            const episodeToUpdate = await episodesService.addEpisode("title", 1, 1, 1);
            expect(episodeToUpdate.title).toEqual("title");
            expect(episodeToUpdate.season).toEqual(1);
            expect(episodeToUpdate.episode_number).toEqual(1);
            expect(episodeToUpdate.rating).toEqual(1);
            const episode = await episodesService.getEpisodeByTitle("title");
            const idToUpdate = episode.id;

            await episodesService.updateEpisode(idToUpdate, "new title", 2, 2, 2);
            const updatedEpisode = await episodesService.getEpisodeByID(idToUpdate)
            expect(updatedEpisode.title).toEqual("new title");
            expect(updatedEpisode.season).toEqual(2);
            expect(updatedEpisode.episode_number).toEqual(2);
            expect(updatedEpisode.rating).toEqual(2);
        });

        it('should throw an error when updating an episode with an existing title in the database', async () => {
            await episodesService.addEpisode("title", 1, 1, 1);
            await episodesService.addEpisode("title2", 1, 1, 1);
            const episode = await episodesService.getEpisodeByTitle("title2");
            const idToUpdate = episode.id;
            await expect(episodesService.updateEpisode(idToUpdate, "title", 1, 1, 1)).rejects.toThrowError("An episode with the title 'title' already exists")
        });
    });

    describe('deleteEpisodeByID', () => {
        it('should delete the episode with given the id', async () => {
            expect(await episodesService.getLength()).toEqual(0);
            await episodesService.addEpisode("title", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            const episode = await episodesService.getEpisodeByTitle("title");
            const idToUpdate = episode.id;
            await episodesService.deleteEpisodeByID(idToUpdate);
            expect(await episodesService.getLength()).toEqual(0);
        });
        it('should throw an error if the given id does not exist in the database', async () => {
            await episodesService.addEpisode("title", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            const nonExistentID = 9999;
            await expect(episodesService.deleteEpisodeByID(nonExistentID)).rejects.toThrowError('Episode not found with ID 9999');
            expect(await episodesService.getLength()).toEqual(1);
        })
    });

    describe('deleteEpisodeByTitle', ()=>{
        it('should delete the episode with given the title', async()=>{
            await episodesService.addEpisode("title", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            await episodesService.deleteEpisodeByTitle("title");
            expect(await episodesService.getLength()).toEqual(0);
        });
        it('should throw an error if the given title does not exist in the database', async()=>{
            await episodesService.addEpisode("title", 1, 1, 1);
            expect(await episodesService.getLength()).toEqual(1);
            const nonExistentTitle = "non existent title";
            await expect(episodesService.deleteEpisodeByTitle(nonExistentTitle)).rejects.toThrowError('Episode not found with title non existent title');
            expect(await episodesService.getLength()).toEqual(1);
        });
    });



});
