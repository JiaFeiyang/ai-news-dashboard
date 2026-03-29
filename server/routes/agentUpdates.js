const express = require('express');
const router = express.Router();
const {
  getAllAgentUpdates,
  getAgentUpdateById,
  getAgentUpdatesByStatus,
  searchAgentUpdates,
  getAgentPerformance
} = require('../controllers/agentController');

// GET /api/agent-updates - Get all agent updates
router.get('/', getAllAgentUpdates);

// GET /api/agent-updates/:id - Get agent update by ID
router.get('/:id', getAgentUpdateById);

// GET /api/agent-updates/status/:status - Get agent updates by status
router.get('/status/:status', getAgentUpdatesByStatus);

// GET /api/agent-updates/search - Search agent updates
router.get('/search', searchAgentUpdates);

// GET /api/agent-updates/:id/performance - Get agent performance metrics
router.get('/:id/performance', getAgentPerformance);

module.exports = router;