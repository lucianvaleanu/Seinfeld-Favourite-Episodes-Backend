class UsersService {

    constructor(_userRepository){
        this.usersRepository = _userRepository;
    }

    async addUser(name, email, password){
        const nameExists = await this.usersRepository.getUserByName(name);
        if(nameExists){
            throw new Error(`User with name ${name} already exists`);
        }

        const emailExists = await this.usersRepository.getUserByEmail(email);
        if(emailExists){
            throw new Error(`User with email ${email} already exists`);
        }

        const user = {
            name: name,
            email: email,
            password: password
        }

        await this.usersRepository.addUser(user);
    }

    async logInUser(nameOrEmail){
        const storedUser = await this.usersRepository.getUserByNameOrEmail(nameOrEmail);
        if(!storedUser){
            throw new Error("No such user exists!");
        }
        return storedUser;
    }

}

module.exports = UsersService;