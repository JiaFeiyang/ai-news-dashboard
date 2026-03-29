const fs = require('fs');
const path = require('path');

// Mock data for demonstration
let socialPosts = [
  {
    id: 1,
    platform: 'twitter',
    username: '@TechNewsAI',
    content: 'Breaking: New breakthrough in natural language processing could revolutionize how we interact with AI assistants.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 245,
    shares: 32,
    retweets: 18,
    sentiment: 'positive'
  },
  {
    id: 2,
    platform: 'reddit',
    username: 'u/AIenthusiast',
    content: 'Just tried the new AI-powered dashboard for news aggregation. The real-time updates are impressive!',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 189,
    shares: 15,
    retweets: 7,
    sentiment: 'positive'
  },
  {
    id: 3,
    platform: 'linkedin',
    username: 'John Smith',
    content: 'Thoughts on the latest developments in AI ethics? The discussion around responsible AI is becoming increasingly important.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    likes: 98,
    shares: 21,
    retweets: 5,
    sentiment: 'neutral'
  }
];

/**
 * Get all social content
 * @param req Request object
 * @param res Response object
 */
const getAllSocialContent = async (req, res) => {
  try {
    // Simulate delay for realistic API response
    await new Promise(resolve => setTimeout(resolve, 300));

    const { platform, sortBy = 'timestamp', order = 'desc', limit = 10 } = req.query;

    let filteredPosts = [...socialPosts];

    // Filter by platform if specified
    if (platform) {
      filteredPosts = filteredPosts.filter(post => post.platform === platform);
    }

    // Sort posts
    filteredPosts.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle timestamp comparison
      if (sortBy === 'timestamp') {
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
    const limitedPosts = filteredPosts.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: limitedPosts,
      count: limitedPosts.length,
      total: filteredPosts.length
    });
  } catch (error) {
    console.error('Error fetching social content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching social content',
      error: error.message
    });
  }
};

/**
 * Get social content by ID
 * @param req Request object
 * @param res Response object
 */
const getSocialContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    const post = socialPosts.find(p => p.id === postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Social post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching social content by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching social content',
      error: error.message
    });
  }
};

/**
 * Get social content by platform
 * @param req Request object
 * @param res Response object
 */
const getSocialContentByPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const { sortBy = 'timestamp', order = 'desc', limit = 10 } = req.query;

    let platformPosts = socialPosts.filter(post => post.platform === platform);

    // Sort posts
    platformPosts.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle timestamp comparison
      if (sortBy === 'timestamp') {
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
    const limitedPosts = platformPosts.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: limitedPosts,
      count: limitedPosts.length,
      total: platformPosts.length
    });
  } catch (error) {
    console.error('Error fetching social content by platform:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching social content',
      error: error.message
    });
  }
};

/**
 * Search social content
 * @param req Request object
 * @param res Response object
 */
const searchSocialContent = async (req, res) => {
  try {
    const { q, platform, sentiment } = req.query;

    let filteredPosts = [...socialPosts];

    // Apply search term filter
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.content.toLowerCase().includes(searchTerm) ||
        post.username.toLowerCase().includes(searchTerm)
      );
    }

    // Apply platform filter
    if (platform) {
      filteredPosts = filteredPosts.filter(post => post.platform === platform);
    }

    // Apply sentiment filter
    if (sentiment) {
      filteredPosts = filteredPosts.filter(post => post.sentiment === sentiment);
    }

    res.status(200).json({
      success: true,
      data: filteredPosts,
      count: filteredPosts.length
    });
  } catch (error) {
    console.error('Error searching social content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while searching social content',
      error: error.message
    });
  }
};

module.exports = {
  getAllSocialContent,
  getSocialContentById,
  getSocialContentByPlatform,
  searchSocialContent
};