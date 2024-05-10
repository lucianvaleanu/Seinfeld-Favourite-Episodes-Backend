const { sequelize } = require('../database');
const { DataTypes } = require('sequelize');

const Episode = sequelize.define('Episode', {
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
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Rating must be between 1 and 10'
            },
            max: {
                args: [10],
                msg: 'Rating must be between 1 and 10'
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'episodes'
});

module.exports = Episode;
