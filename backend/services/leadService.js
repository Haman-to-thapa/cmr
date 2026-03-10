const Agent = require('../models/Agent');

const assignLeadToAgent = async () => {
    // Find the agent who was assigned a lead the longest time ago
    // and is active (you could add an 'isActive' field later)
    const agent = await Agent.findOne().sort({ lastAssigned: 1 });

    if (!agent) {
        return null;
    }

    // Update lastAssigned and activeLeads
    agent.lastAssigned = new Date();
    agent.activeLeads += 1;
    await agent.save();

    return agent;
};

module.exports = { assignLeadToAgent };
