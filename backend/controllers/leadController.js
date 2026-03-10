const Lead = require('../models/Lead');
const Agent = require('../models/Agent');
const Activity = require('../models/Activity');
const { assignLeadToAgent } = require('../services/leadService');

// Capture a new lead
const captureLead = async (req, res) => {
    try {
        const { name, phone, source } = req.body;

        // Create the lead
        const lead = new Lead({ name, phone, source });

        // Assign to an agent
        const agent = await assignLeadToAgent();
        if (agent) {
            lead.assignedAgent = agent._id;
        }

        await lead.save();

        // Record activity
        const activity = new Activity({
            leadId: lead._id,
            action: `Lead captured and assigned to ${agent ? agent.name : 'Nobody'}`
        });
        await activity.save();

        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update lead status
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await Lead.findById(id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        const oldStatus = lead.leadStatus;
        lead.leadStatus = status;
        lead.lastActivity = new Date();
        await lead.save();

        // Record activity
        const activity = new Activity({
            leadId: lead._id,
            action: `Status changed from ${oldStatus} to ${status}`
        });
        await activity.save();

        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all leads
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('assignedAgent');
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get lead by ID
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('assignedAgent');
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        const activities = await Activity.find({ leadId: lead._id }).sort({ timestamp: -1 });

        res.status(200).json({ lead, activities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { captureLead, updateLeadStatus, getLeads, getLeadById };
