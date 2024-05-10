class UsersRepository {
    constructor(_userModel) {
        this.userModel = _userModel;
    }

    async getUserByName(name){
        return await this.userModel.findOne({ where: { name } });
    }

    async getUserByEmail(email){
        return await this.userModel.findOne({ where: { email } });
    }

    async getUserByNameOrEmail(nameOrEmail){
        let user;
        const isEmail = /\S+@\S+\.\S+/;
        if (isEmail.test(nameOrEmail)) {
            user = await this.getUserByEmail(nameOrEmail);
        } else {
            user = await this.getUserByName(nameOrEmail);
        }
        return user;
    }

    async addUser(user){
        return await this.userModel.create(user);
    }


}

module.exports = UsersRepository;