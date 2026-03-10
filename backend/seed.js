const mongoose = require('mongoose');
const Agent = require('./models/Agent');
require('dotenv').config();

const agents = [
    { name: 'Rahul Sharma', email: 'rahul@gharpayy.com' },
    { name: 'Priya Singh', email: 'priya@gharpayy.com' },
    { name: 'Amit Verma', email: 'amit@gharpayy.com' }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gharpayy')
    .then(async () => {
        console.log('Connected to MongoDB');
        await Agent.deleteMany({});
        await Agent.insertMany(agents);
        console.log('Agents seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
