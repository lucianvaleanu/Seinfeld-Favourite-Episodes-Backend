const router = require("express").Router();


const UserModel = require('../models/users.model');
const UsersRepository = require('../repositories/users.repository');
const UsersService = require('../services/users.service');
const UsersController = require('../controllers/users.controller');

const usersController = new UsersController(new UsersService(new UsersRepository(UserModel)));

router.post('/signup', usersController.signUp.bind(usersController));

router.post('/login', usersController.logIn.bind(usersController));

module.exports = router;

