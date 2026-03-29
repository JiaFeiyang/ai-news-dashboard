import React from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import ContentTabs from './components/ContentTabs';
import './App.css';

function App() {
  // Sample tabs for the dashboard
  const tabs = [
    { id: 'social-feeds', title: 'Social Feeds' },
    { id: 'agent-updates', title: 'Agent Updates' },
    { id: 'news-highlights', title: 'News Highlights' }
  ];

  return (
    <div className="App">
      <Header title="AI News Dashboard" subtitle="Stay updated with the latest in AI" />

      <main className="dashboard-main">
        <Filters onFilterChange={(filters) => console.log('Filters changed:', filters)} />

        <ContentTabs tabs={tabs}>
          <div tabId="social-feeds" className="tab-panel">
            <h2>Social Feeds</h2>
            <p>Content for social feeds will appear here.</p>
          </div>

          <div tabId="agent-updates" className="tab-panel">
            <h2>Agent Updates</h2>
            <p>Content for agent updates will appear here.</p>
          </div>

          <div tabId="news-highlights" className="tab-panel">
            <h2>News Highlights</h2>
            <p>Content for news highlights will appear here.</p>
          </div>
        </ContentTabs>
      </main>
    </div>
  );
}

export default App;
