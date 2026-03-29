import React from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import ContentTabs from './components/ContentTabs';
import SocialCardFeed from './components/SocialCardFeed';
import AgentUpdatesFeed from './components/AgentUpdatesFeed';
import './App.css';

function App() {
  // Sample tabs for the dashboard
  const tabs = [
    { id: 'social-feeds', title: 'Social Feeds' },
    { id: 'agent-updates', title: 'Agent Updates' },
    { id: 'news-highlights', title: 'News Highlights' }
  ];

  // Sample social posts data
  const socialPosts = [
    {
      id: 1,
      platform: 'twitter',
      author: 'AI Researcher',
      avatar: '/placeholder-avatar.jpg',
      contentEn: 'Just published a new paper on transformer architectures that significantly reduces computational overhead while improving performance. Key insight: dynamic attention mechanisms can adapt to input complexity.',
      contentCh: '刚刚发表了一篇关于transformer架构的新论文，在提高性能的同时显著降低了计算开销。关键见解：动态注意力机制可以适应输入复杂性。',
      timestamp: new Date().toISOString(),
      engagement: { likes: 245, shares: 89, comments: 42 }
    },
    {
      id: 2,
      platform: 'linkedin',
      author: 'Tech Leader',
      avatar: '/placeholder-avatar.jpg',
      contentEn: 'The future of AI lies in multimodal systems that can seamlessly combine text, vision, and audio inputs. Excited to announce our new project focusing on unified perception models.',
      contentCh: 'AI的未来在于能够无缝结合文本、视觉和音频输入的多模态系统。很高兴宣布我们专注于统一感知模型的新项目。',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      engagement: { likes: 187, shares: 56, comments: 23 }
    },
    {
      id: 3,
      platform: 'github',
      author: 'Open Source Dev',
      avatar: '/placeholder-avatar.jpg',
      contentEn: 'Released v2.1.0 of our neural network library with 40% training speed improvements and native support for quantum-inspired algorithms. Contributions welcome!',
      contentCh: '发布了我们的神经网络库v2.1.0版，训练速度提升40%，并原生支持量子启发算法。欢迎贡献代码！',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      engagement: { likes: 321, shares: 120, comments: 67 }
    }
  ];

  return (
    <div className="App">
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
              updates={[
                {
                  agentName: 'Research Agent',
                  timestamp: '2 hours ago',
                  status: 'Active',
                  updateText: 'Completed analysis of latest transformer models. Identified 3 potential optimizations for inference speed.'
                },
                {
                  agentName: 'News Aggregator',
                  timestamp: '4 hours ago',
                  status: 'Warning',
                  updateText: 'Detected unusual spike in AI news volume. Activated additional verification protocols.'
                },
                {
                  agentName: 'Sentiment Analyzer',
                  timestamp: '6 hours ago',
                  status: 'Offline',
                  updateText: 'Scheduled maintenance in progress. Will resume normal operation shortly.'
                }
              ]}
              onAgentClick={(agentName) => alert(`Clicked on agent: ${agentName}`)}
            />
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
