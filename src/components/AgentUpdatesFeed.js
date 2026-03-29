import React from 'react';
import AgentUpdateCard from './AgentUpdateCard';
import './AgentUpdatesFeed.css';

const AgentUpdatesFeed = ({ updates, onAgentClick }) => {
  if (!updates || updates.length === 0) {
    return (
      <div className="agent-updates-feed">
        <p className="no-updates">No agent updates available.</p>
      </div>
    );
  }

  return (
    <div className="agent-updates-feed">
      {updates.map((update, index) => (
        <AgentUpdateCard
          key={index}
          agentName={update.agentName}
          timestamp={update.timestamp}
          status={update.status}
          updateText={update.updateText}
          onAgentClick={onAgentClick}
        />
      ))}
    </div>
  );
};

export default AgentUpdatesFeed;