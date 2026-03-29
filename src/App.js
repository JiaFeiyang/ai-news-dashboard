import React from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import ContentTabs from './components/ContentTabs';
import SocialCardFeed from './components/SocialCardFeed';
import AgentUpdatesFeed from './components/AgentUpdatesFeed';
import useSocialData from './hooks/useSocialData';
import useAgentUpdates from './hooks/useAgentUpdates';
import './App.css';

function App() {
  // Sample tabs for the dashboard
  const tabs = [
    { id: 'social-feeds', title: 'Social Feeds' },
    { id: 'agent-updates', title: 'Agent Updates' },
    { id: 'news-highlights', title: 'News Highlights' }
  ];

  // Use custom hooks to fetch data from API
  const {
    socialPosts,
    loading: socialLoading,
    error: socialError,
    refreshSocialFeeds
  } = useSocialData();

  const {
    agentUpdates,
    loading: agentLoading,
    error: agentError,
    refreshAgentUpdates
  } = useAgentUpdates();

  // Show loading states
  if (socialLoading || agentLoading) {
    return (
      <div className="App dashboard-container">
        <Header title="AI News Dashboard" subtitle="Stay updated with the latest in AI" />
        <main className="dashboard-main">
          <div className="loading-spinner"></div>
        </main>
      </div>
    );
  }

  // Show error states
  if (socialError || agentError) {
    return (
      <div className="App dashboard-container">
        <Header title="AI News Dashboard" subtitle="Stay updated with the latest in AI" />
        <main className="dashboard-main">
          <div className="error-message">
            <h2>Error loading data</h2>
            {socialError && <p>Social feeds error: {socialError}</p>}
            {agentError && <p>Agent updates error: {agentError}</p>}
            <button onClick={() => {
              refreshSocialFeeds();
              refreshAgentUpdates();
            }}>Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App dashboard-container">
      <Header title="AI News Dashboard" subtitle="Stay updated with the latest in AI" />

      <main className="dashboard-main">
        <Filters onFilterChange={(filters) => console.log('Filters changed:', filters)} />

        <ContentTabs tabs={tabs}>
          <div tabId="social-feeds" className="tab-panel">
            <h2>Social Feeds</h2>
            <SocialCardFeed posts={socialPosts} />
          </div>

          <div tabId="agent-updates" className="tab-panel">
            <h2>Agent Updates</h2>
            <AgentUpdatesFeed
              updates={agentUpdates}
              onAgentClick={(agentName) => alert(`Clicked on agent: ${agentName}`)}
            />
          </div>

          <div tabId="news-highlights" className="tab-panel">
            <h2>News Highlights</h2>
            <div className="empty-state">
              <div className="empty-state-icon">📰</div>
              <h3 className="empty-state-title">News Highlights Coming Soon</h3>
              <p className="empty-state-description">This section will showcase the most important AI news highlights.</p>
            </div>
          </div>
        </ContentTabs>
      </main>
    </div>
  );
}

export default App;