import React, { useState } from 'react';
import '../App.css';

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    dateRange: '',
    category: '',
    source: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };

    setFilters(updatedFilters);

    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  return (
    <div className="dashboard-filters">
      <div className="filter-group">
        <label htmlFor="dateRange">Date Range:</label>
        <select
          id="dateRange"
          name="dateRange"
          value={filters.dateRange}
          onChange={handleInputChange}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
        >
          <option value="">All Categories</option>
          <option value="ai-research">AI Research</option>
          <option value="machine-learning">Machine Learning</option>
          <option value="nlp">Natural Language Processing</option>
          <option value="computer-vision">Computer Vision</option>
          <option value="robotics">Robotics</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="source">Source:</label>
        <select
          id="source"
          name="source"
          value={filters.source}
          onChange={handleInputChange}
        >
          <option value="">All Sources</option>
          <option value="arxiv">arXiv</option>
          <option value="techcrunch">TechCrunch</option>
          <option value="wired">Wired</option>
          <option value="nature">Nature</option>
          <option value="science">Science</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;