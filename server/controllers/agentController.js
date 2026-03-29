const fs = require('fs');
const path = require('path');

// Mock data for demonstration
let agentUpdates = [
  {
    id: 1,
    agentName: 'GPT-4 Turbo',
    version: '4.0.12',
    status: 'online',
    lastUpdated: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    capabilities: ['text-generation', 'image-analysis', 'real-time-data'],
    description: 'Latest version with improved reasoning capabilities and reduced hallucination.',
    performanceMetrics: {
      accuracy: 94.2,
      responseTime: 245, // ms
      uptime: 99.9
    }
  },
  {
    id: 2,
    agentName: 'Claude 3 Opus',
    version: '3.1.8',
    status: 'online',
    lastUpdated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    capabilities: ['long-context', 'reasoning', 'coding'],
    description: 'Enhanced reasoning and document analysis capabilities.',
    performanceMetrics: {
      accuracy: 96.7,
      responseTime: 320, // ms
      uptime: 99.7
    }
  },
  {
    id: 3,
    agentName: 'Gemini Pro',
    version: '1.5',
    status: 'maintenance',
    lastUpdated: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    capabilities: ['multimodal', 'coding', 'reasoning'],
    description: 'Undergoing scheduled maintenance for performance optimization.',
    performanceMetrics: {
      accuracy: 92.5,
      responseTime: 280, // ms
      uptime: 99.5
    }
  },
  {
    id: 4,
    agentName: 'LLaMA 2 Enterprise',
    version: '2.5.1',
    status: 'offline',
    lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    capabilities: ['open-source', 'customizable', 'on-premise'],
    description: 'Scheduled for version upgrade tomorrow.',
    performanceMetrics: {
      accuracy: 89.3,
      responseTime: 410, // ms
      uptime: 98.2
    }
  }
];

/**
 * Get all agent updates
 * @param req Request object
 * @param res Response object
 */
const getAllAgentUpdates = async (req, res) => {
  try {
    // Simulate delay for realistic API response
    await new Promise(resolve => setTimeout(resolve, 300));

    const { status, sortBy = 'lastUpdated', order = 'desc', limit = 10 } = req.query;

    let filteredUpdates = [...agentUpdates];

    // Filter by status if specified
    if (status) {
      filteredUpdates = filteredUpdates.filter(update => update.status === status);
    }

    // Sort updates
    filteredUpdates.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle timestamp comparison
      if (sortBy === 'lastUpdated') {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (order === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    // Limit results
    const limitedUpdates = filteredUpdates.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: limitedUpdates,
      count: limitedUpdates.length,
      total: filteredUpdates.length
    });
  } catch (error) {
    console.error('Error fetching agent updates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching agent updates',
      error: error.message
    });
  }
};

/**
 * Get agent update by ID
 * @param req Request object
 * @param res Response object
 */
const getAgentUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    const agentId = parseInt(id);

    const agent = agentUpdates.find(a => a.id === agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent update not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent update by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching agent update',
      error: error.message
    });
  }
};

/**
 * Get agent updates by status
 * @param req Request object
 * @param res Response object
 */
const getAgentUpdatesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { sortBy = 'lastUpdated', order = 'desc', limit = 10 } = req.query;

    let statusUpdates = agentUpdates.filter(update => update.status === status);

    // Sort updates
    statusUpdates.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle timestamp comparison
      if (sortBy === 'lastUpdated') {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (order === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    // Limit results
    const limitedUpdates = statusUpdates.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: limitedUpdates,
      count: limitedUpdates.length,
      total: statusUpdates.length
    });
  } catch (error) {
    console.error('Error fetching agent updates by status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching agent updates',
      error: error.message
    });
  }
};

/**
 * Search agent updates
 * @param req Request object
 * @param res Response object
 */
const searchAgentUpdates = async (req, res) => {
  try {
    const { q, status, capability } = req.query;

    let filteredUpdates = [...agentUpdates];

    // Apply search term filter
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredUpdates = filteredUpdates.filter(update =>
        update.agentName.toLowerCase().includes(searchTerm) ||
        update.description.toLowerCase().includes(searchTerm) ||
        update.version.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (status) {
      filteredUpdates = filteredUpdates.filter(update => update.status === status);
    }

    // Apply capability filter
    if (capability) {
      filteredUpdates = filteredUpdates.filter(update =>
        update.capabilities.includes(capability)
      );
    }

    res.status(200).json({
      success: true,
      data: filteredUpdates,
      count: filteredUpdates.length
    });
  } catch (error) {
    console.error('Error searching agent updates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while searching agent updates',
      error: error.message
    });
  }
};

/**
 * Get agent performance metrics
 * @param req Request object
 * @param res Response object
 */
const getAgentPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const agentId = parseInt(id);

    const agent = agentUpdates.find(a => a.id === agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent update not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent.performanceMetrics
    });
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching agent performance metrics',
      error: error.message
    });
  }
};

module.exports = {
  getAllAgentUpdates,
  getAgentUpdateById,
  getAgentUpdatesByStatus,
  searchAgentUpdates,
  getAgentPerformance
};