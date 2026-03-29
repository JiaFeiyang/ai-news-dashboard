import React from 'react';
import SocialCard from './SocialCard';

/**
 * SocialCardFeed Component
 * Displays a list of social media posts
 * @param {Object} props - Component properties
 * @param {Array} props.posts - Array of social media posts
 */
const SocialCardFeed = ({ posts = [] }) => {
  return (
    <div className="social-card-feed">
      {posts.length === 0 ? (
        <div className="social-card-empty">No posts to display</div>
      ) : (
        posts.map((post, index) => (
          <SocialCard
            key={post.id || index}
            platform={post.platform}
            author={post.author}
            avatar={post.avatar}
            contentEn={post.contentEn}
            contentCh={post.contentCh}
            timestamp={post.timestamp}
            engagement={post.engagement}
          />
        ))
      )}
    </div>
  );
};

export default SocialCardFeed;