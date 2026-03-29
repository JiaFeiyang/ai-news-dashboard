import React, { useState } from 'react';

/**
 * SocialCard Component
 * Displays a single social media post with bilingual support
 * @param {Object} props - Component properties
 * @param {string} props.platform - Platform name (e.g., 'twitter', 'linkedin', 'github')
 * @param {string} props.author - Post author
 * @param {string} props.avatar - Author's avatar URL
 * @param {string} props.contentEn - English content
 * @param {string} props.contentCh - Chinese content
 * @param {Date} props.timestamp - Post timestamp
 * @param {Array} props.engagement - Engagement metrics (likes, shares, comments)
 */
const SocialCard = ({ platform, author, avatar, contentEn, contentCh, timestamp, engagement }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ch' : 'en');
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get current content based on selected language
  const currentContent = language === 'en' ? contentEn : contentCh;
  const contentToDisplay = isExpanded ? currentContent : currentContent.substring(0, 200);

  // Format timestamp
  const formattedTime = new Date(timestamp).toLocaleString();

  // Platform icons mapping
  const platformIcons = {
    twitter: '🐦',
    linkedin: '💼',
    github: '🐙',
    weibo: '📝',
    reddit: '🤖',
    other: '💬'
  };

  const platformIcon = platformIcons[platform] || platformIcons.other;

  return (
    <div className="social-card">
      <div className="social-card-header">
        <img src={avatar} alt={`${author}'s avatar`} className="social-card-avatar" />
        <div className="social-card-author-info">
          <h4 className="social-card-author">{author}</h4>
          <div className="social-card-meta">
            <span className="social-card-platform" title={platform}>{platformIcon}</span>
            <span className="social-card-time">{formattedTime}</span>
          </div>
        </div>
        <button
          className={`social-card-lang-toggle ${language === 'en' ? 'active' : ''}`}
          onClick={toggleLanguage}
        >
          {language === 'en' ? '中' : 'EN'}
        </button>
      </div>

      <div className="social-card-content">
        <p>{contentToDisplay}{currentContent.length > 200 && !isExpanded && '...'}</p>
        {currentContent.length > 200 && (
          <button className="social-card-expand-btn" onClick={toggleExpand}>
            {isExpanded ? '收起' : '展开'}
          </button>
        )}
      </div>

      <div className="social-card-engagement">
        <span className="engagement-item">👍 {engagement.likes}</span>
        <span className="engagement-item">🔄 {engagement.shares}</span>
        <span className="engagement-item">💬 {engagement.comments}</span>
      </div>
    </div>
  );
};

export default SocialCard;