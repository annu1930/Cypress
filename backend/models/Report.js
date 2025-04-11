// models/Report.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Import the User model

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM('pothole', 'streetlight', 'garbage', 'other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
    defaultValue: 'Pending',
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt columns
  tableName: 'Reports',
});

module.exports = Report;
