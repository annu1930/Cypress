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
  const { email, password, full_name } = req.body;
  console.log('Registering user:', req.body);  // Log request body

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({ email, password: hashedPassword, full_name });
    console.log('User created:', user);  // Log the created user
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);  // Log the error
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  

  try {
    // Check if the user exists
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Create Report Route
app.post('/report', async (req, res) => {
  const { title, description, location, type, user_id } = req.body;
  console.log('Creating report:', req.body);  // Log the request

  try {
    // Create the report
    const report = await Report.create({
      title,
      description,
      location,
      type,
      user_id,
    });

    console.log('Report created:', report);  // Log the created report
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);  // Log the error
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
});

// Get All Reports Route
app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);  // Log the error
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// Sync database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log('Server is running on port 3000'));
}).catch((error) => {
  console.error('Error syncing the database:', error);
});
