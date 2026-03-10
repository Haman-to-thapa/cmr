const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    propertyName: { type: String, required: true },
    visitDate: { type: Date, required: true },
    visitTime: { type: String, required: true }, // E.g., "14:00"
    outcome: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Visit', VisitSchema);
