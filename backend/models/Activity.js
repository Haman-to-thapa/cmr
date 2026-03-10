const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    action: { type: String, required: true }, // E.g., "Status changed to Contacted"
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
