const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true }, // Website, Google Form, etc.
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  leadStatus: {
    type: String,
    enum: [
      'New Lead',
      'Contacted',
      'Requirement Collected',
      'Property Suggested',
      'Visit Scheduled',
      'Visit Completed',
      'Booked',
      'Lost'
    ],
    default: 'New Lead'
  },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
