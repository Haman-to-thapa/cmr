const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    activeLeads: { type: Number, default: 0 },
    lastAssigned: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);
