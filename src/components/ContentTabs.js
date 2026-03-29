import React, { useState } from 'react';
import '../App.css';

const ContentTabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(tabs && tabs.length > 0 ? tabs[0].id : '');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="content-tabs">
      <div className="tab-list">
        {tabs && tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children && Array.isArray(children)
          ? children.find(child => child.props.tabId === activeTab)
          : children}
      </div>
    </div>
  );
};

export default ContentTabs;