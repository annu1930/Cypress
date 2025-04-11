require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Report = require('./models/Report');
const sequelize = require('./db');

const app = express();
app.use(express.json()); // For parsing JSON bodies

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ full_name: name, email, password: hashedPassword });

    res.status(201).json({ id: newUser.id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error creating account", error: error.message });
  }
});
// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Create Report Route
app.post('/report', async (req, res) => {
  const { title, description, location, type, user_id } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !location || !type || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the report
    const report = await Report.create({
      title,
      description,
      location,
      type,
      user_id,
    });

    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
});

// Get All Reports Route
app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
});

// Forgot Username
app.post('/forgot-username', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Send email with username
    await sendEmail(email, `Your username is: ${user.full_name}`);
    res.status(200).json({ message: "Username sent to email" });
  } catch (error) {
    console.error("Error retrieving username:", error);
    res.status(500).json({ message: "Error retrieving username", error: error.message });
  }
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate reset token and send email
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await sendEmail(email, `Reset your password using this link: http://localhost:3000/reset-password?token=${resetToken}`);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});

// Sync database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log('Server is running on port 3000'));
}).catch((error) => {
  console.error("Error syncing the database:", error);
});