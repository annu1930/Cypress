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

async function fetchReports() {
  try {
    const response = await fetch("http://localhost:3000/reports");
    if (response.ok) {
      const reports = await response.json();
      const reportsTableBody = document.querySelector("#reportsTable tbody");
      reportsTableBody.innerHTML = ""; // Clear existing rows

      reports.forEach((report) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${report.id}</td>
          <td>${report.title}</td>
          <td>${report.description}</td>
          <td>${report.location}</td>
          <td>${report.status}</td>
        `;
        reportsTableBody.appendChild(row);
      });
    } else {
      alert("Failed to fetch reports.");
    }
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
}

// Call fetchReports on page load
document.addEventListener("DOMContentLoaded", fetchReports);
