import React from 'react';
import './AgentUpdateCard.css';

const AgentUpdateCard = ({ agentName, timestamp, status, updateText, onAgentClick }) => {
  const handleCardClick = () => {
    if (onAgentClick) {
      onAgentClick(agentName);
    }
  };

  return (
    <div className="agent-update-card" onClick={handleCardClick}>
      <div className="agent-update-header">
        <h3 className="agent-name">{agentName}</h3>
        <span className="update-timestamp">{timestamp}</span>
      </div>
      <div className="agent-status">
        <span className={`status-indicator ${status.toLowerCase()}`}></span>
        <span className="status-text">{status}</span>
      </div>
      <div className="update-content">
        <p>{updateText}</p>
      </div>
    </div>
  );
};

export default AgentUpdateCard;