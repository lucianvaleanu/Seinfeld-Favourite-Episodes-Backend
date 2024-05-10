const Joi = require('joi');

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).required()
});

class UsersController {

    constructor(_usersService) {
        this.usersService = _usersService;
    }

    async signUp(req, res) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        try {
            this.validateInput(userSchema, { name, email, password });
            const hashedPassword = await bcrypt.hash(password, 12);
            await this.usersService.addUser(name, email, hashedPassword)
            res.status(201).json({ message: "User registered" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async logIn(req, res) {
        const nameOrEmail = req.body.nameOrEmail;
        const password = req.body.password;
        try{
            const storedUser = await this.usersService.logInUser(nameOrEmail);
            const isEqual = await bcrypt.compare(password, storedUser.password);
            if(!isEqual){
                throw new Error("Incorrect password!");
            }
    
            const token = jwt.sign(
                {
                    email: storedUser.email,
                    userId: storedUser.id
                },
                'secretfortoken',
                {expiresIn: '1h'}
            );
            res.status(200).json({token: token, userId: storedUser.id});
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

module.exports = UsersController;
