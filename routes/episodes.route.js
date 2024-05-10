const router = require("express").Router();

const auth = require('../middleware/auth');

const EpisodeModel = require('../models/episode.model');
const EpisodesRepository = require('../repositories/episodes.repository');
const EpisodesService = require('../services/episodes.service');
const EpisodesController = require('../controllers/episodes.controller');

const episodesController = new EpisodesController(new EpisodesService(new EpisodesRepository(EpisodeModel)));

router.get('/', auth, episodesController.getAllEpisodes.bind(episodesController));
router.get('/length/', auth, episodesController.getLength.bind(episodesController));
router.get('/id/:id', auth, episodesController.getEpisodeByID.bind(episodesController));
router.get('/title/:title', auth, episodesController.getEpisodeByTitle.bind(episodesController));
router.get('/page/:page/:items', auth, episodesController.getEpisodesByPage.bind(episodesController));
router.get('/sorted', auth, episodesController.getSortedEpisodes.bind(episodesController));
router.get('/season/:season', auth, episodesController.getEpisodesBySeason.bind(episodesController));
router.get('/rating/:rating', auth, episodesController.getEpisodesByRating.bind(episodesController));
router.get('/search/:title', auth, episodesController.searchEpisodesByTitle.bind(episodesController));
router.get('/pie-chart-data', auth, episodesController.getPieChartData.bind(episodesController));

router.post('/', auth, episodesController.createEpisode.bind(episodesController));

router.put('/id/:id', auth, episodesController.updateEpisode.bind(episodesController));

router.delete('/:id', auth, episodesController.deleteEpisodeByID.bind(episodesController));
router.delete('/title/:title', auth, episodesController.deleteEpisodeByTitle.bind(episodesController));

module.exports = router;

