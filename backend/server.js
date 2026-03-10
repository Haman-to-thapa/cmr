const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const leadRoutes = require('./routes/leadRoutes');
const miscRoutes = require('./routes/miscRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api', miscRoutes);

// Health check
app.get('/', (req, res) => res.send('Gharpayy CRM API is running...'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharpayy')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Database connection error:', err));
