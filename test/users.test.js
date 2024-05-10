const { Sequelize, DataTypes } = require('sequelize');
const UsersRepository = require('../repositories/users.repository');
const UsersService = require('../services/users.service');

describe('Episodes', () => {
    let sequelize;
    let UserModel;
    let usersRepository;
    let usersService;

    beforeEach(async () => {
        sequelize = new Sequelize('sqlite://:memory:', {
            logging: false
        });
        UserModel = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        await sequelize.sync();
        usersRepository = new UsersRepository(UserModel);
        usersService = new UsersService(usersRepository);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    describe('addUser', () => {
        it('should successfully add an user', async () => {
            await usersService.addUser('username', 'username@email.com', 'password');
            const usersCount = await UserModel.count();
            expect(usersCount).toEqual(1);
        });

        it('should throw an error when adding an user whose username already exists', async () => {
            await usersService.addUser('username', 'username@email.com', 'password');
            await expect(usersService.addUser('username', 'username2@email.com', 'password')).rejects.toThrowError("User with name username already exists");
        });

        it('should throw an error when adding an user whose email already exists', async () => {
            await usersService.addUser('username', 'username@email.com', 'password');
            await expect(usersService.addUser('username2', 'username@email.com', 'password')).rejects.toThrowError("User with email username@email.com already exists");
        });
    });

    describe('logInUser', () => {
        it('should successfully get an user by it\'s username', async () => {
            await usersService.addUser('username', 'username@email.com', 'password');
            const user = await usersService.logInUser('username');
            expect(user.name).toEqual('username');
            expect(user.email).toEqual('username@email.com');
            expect(user.password).toEqual('password');
        });

        it('should successfully get an user by it\'s email', async () => {
            await usersService.addUser('username', 'username@email.com', 'password');
            const user = await usersService.logInUser('username@email.com');
            expect(user.name).toEqual('username');
            expect(user.email).toEqual('username@email.com');
            expect(user.password).toEqual('password');
        });

        it('should throw an error if the given username doest exist in the database', async () => {
            await expect(usersService.logInUser('nonexistentusername')).rejects.toThrowError("No such user exists!");
        });

        it('should throw an error if the given email doest exist in the database', async () => {
            await expect(usersService.logInUser('nonexistent@email.com')).rejects.toThrowError("No such user exists!");
        });
    });
});
