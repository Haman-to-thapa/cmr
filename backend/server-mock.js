const express = require('express');
const cors = require('cors');
const { leads, agents, visits, activities } = require('./mockDb');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/leads', (req, res) => {
    const { name, phone, source } = req.body;
    const lead = { _id: Date.now().toString(), name, phone, source, leadStatus: 'New Lead', createdAt: new Date() };

    // Round-robin
    const agent = agents.sort((a, b) => new Date(a.lastAssigned) - new Date(b.lastAssigned))[0];
    if (agent) {
        lead.assignedAgent = agent;
        agent.lastAssigned = new Date();
    }

    leads.push(lead);
    activities.push({ leadId: lead._id, action: `Lead captured and assigned to ${agent.name}`, timestamp: new Date() });
    res.status(201).json(lead);
});

app.get('/api/leads', (req, res) => res.json(leads));

app.get('/api/leads/:id', (req, res) => {
    const lead = leads.find(l => l._id === req.params.id);
    const leadActivities = activities.filter(a => a.leadId === req.params.id);
    res.json({ lead, activities: leadActivities });
});

app.patch('/api/leads/:id/status', (req, res) => {
    const lead = leads.find(l => l._id === req.params.id);
    if (lead) {
        const oldStatus = lead.leadStatus;
        lead.leadStatus = req.body.status;
        activities.push({ leadId: lead._id, action: `Status changed from ${oldStatus} to ${req.body.status}`, timestamp: new Date() });
    }
    res.json(lead);
});

app.post('/api/visits', (req, res) => {
    const { leadId, propertyName, visitDate, visitTime } = req.body;
    const visit = { _id: Date.now().toString(), leadId, propertyName, visitDate, visitTime, outcome: 'Scheduled' };
    visits.push(visit);

    const lead = leads.find(l => l._id === leadId);
    if (lead) {
        lead.leadStatus = 'Visit Scheduled';
        activities.push({ leadId, action: `Visit scheduled at ${propertyName}`, timestamp: new Date() });
    }
    res.json(visit);
});

app.get('/api/dashboard', (req, res) => {
    const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.leadStatus] = (acc[lead.leadStatus] || 0) + 1;
        return acc;
    }, {});

    res.json({
        totalLeads: leads.length,
        leadsByStatus: Object.entries(leadsByStatus).map(([_id, count]) => ({ _id, count })),
        visitsScheduled: visits.length,
        bookings: leads.filter(l => l.leadStatus === 'Booked').length
    });
});

app.listen(PORT, () => console.log(`Mock Server running on port ${PORT}`));
