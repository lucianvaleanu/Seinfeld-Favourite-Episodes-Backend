const { sequelize } = require('../database');
const { DataTypes } = require('sequelize');
const Episode = require('./episode.model'); // Assuming you have Episode model defined

const Review = sequelize.define('Review', {
    reviewID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    episodeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Episode,
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Reviews'
});

Review.belongsTo(Episode, { foreignKey: 'episodeID', onDelete: 'CASCADE' });

module.exports = Review;
