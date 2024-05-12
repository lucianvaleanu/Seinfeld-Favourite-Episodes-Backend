const Sequelize  = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const serverCa = fs.readFileSync('./ssl/DigiCertGlobalRootG2.crt.pem', 'utf8');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
            ca: [serverCa]
        }
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = { sequelize };
