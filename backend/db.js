// db.js
const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize('cypress', 'root', 'Nidhi1807', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
