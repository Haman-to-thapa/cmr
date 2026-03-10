const Visit = require('../models/Visit');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// Schedule a visit
const scheduleVisit = async (req, res) => {
    try {
        const { leadId, propertyName, visitDate, visitTime } = req.body;

        const visit = new Visit({ leadId, propertyName, visitDate, visitTime });
        await visit.save();

        // Update lead status
        const lead = await Lead.findById(leadId);
        if (lead) {
            lead.leadStatus = 'Visit Scheduled';
            await lead.save();

            const activity = new Activity({
                leadId,
                action: `Visit scheduled at ${propertyName} on ${visitDate} ${visitTime}`
            });
            await activity.save();
        }

        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: '$leadStatus', count: { $sum: 1 } } }
        ]);

        const visitsScheduled = await Visit.countDocuments({ outcome: 'Scheduled' });
        const bookings = await Lead.countDocuments({ leadStatus: 'Booked' });

        res.status(200).json({
            totalLeads,
            leadsByStatus,
            visitsScheduled,
            bookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { scheduleVisit, getDashboardStats };
