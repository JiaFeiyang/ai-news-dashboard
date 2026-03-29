import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SocialCard from '../SocialCard';

describe('SocialCard Component', () => {
  const mockProps = {
    platform: 'twitter',
    author: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    contentEn: 'This is a test English content that is quite long to test the expand functionality of the social card component in the news dashboard application.',
    contentCh: '这是一个测试中文内容，很长以测试社交卡片组件的展开功能。',
    timestamp: new Date('2023-01-01T10:00:00Z'),
    engagement: {
      likes: 100,
      shares: 20,
      comments: 10
    }
  };

  test('renders social card with correct information', () => {
    render(<SocialCard {...mockProps} />);

    // Check if author is rendered
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();

    // Check if platform icon is rendered
    expect(screen.getByText('🐦')).toBeInTheDocument();

    // Check if avatar is rendered with correct alt text
    expect(screen.getByAltText(/Test User's avatar/i)).toBeInTheDocument();

    // Check if initial content is displayed (English by default)
    expect(screen.getByText(mockProps.contentEn.substring(0, 200))).toBeInTheDocument();

    // Check if engagement metrics are displayed
    expect(screen.getByText(/👍 100/)).toBeInTheDocument();
    expect(screen.getByText(/🔄 20/)).toBeInTheDocument();
    expect(screen.getByText(/💬 10/)).toBeInTheDocument();
  });

  test('toggles language between English and Chinese', () => {
    render(<SocialCard {...mockProps} />);

    // Initially in English
    expect(screen.getByText(mockProps.contentEn.substring(0, 200))).toBeInTheDocument();
    expect(screen.queryByText(mockProps.contentCh.substring(0, 200))).not.toBeInTheDocument();

    // Toggle to Chinese
    fireEvent.click(screen.getByText('中'));
    expect(screen.queryByText(mockProps.contentEn.substring(0, 200))).not.toBeInTheDocument();
    expect(screen.getByText(mockProps.contentCh.substring(0, 200))).toBeInTheDocument();

    // Toggle back to English
    fireEvent.click(screen.getByText('EN'));
    expect(screen.getByText(mockProps.contentEn.substring(0, 200))).toBeInTheDocument();
    expect(screen.queryByText(mockProps.contentCh.substring(0, 200))).not.toBeInTheDocument();
  });

  test('expands and collapses content when content is long', () => {
    render(<SocialCard {...mockProps} />);

    // Initially should show truncated content with "..."
    const contentElement = screen.getByText(/This is a test English content/);
    expect(contentElement).toHaveTextContent(expect.stringContaining('...'));

    // Click expand button
    const expandButton = screen.getByText('展开');
    fireEvent.click(expandButton);

    // Should show full content
    expect(screen.getByText(mockProps.contentEn)).toBeInTheDocument();
    expect(screen.getByText('收起')).toBeInTheDocument();

    // Click collapse button
    fireEvent.click(screen.getByText('收起'));

    // Should show truncated content again
    expect(screen.getByText(mockProps.contentEn.substring(0, 200))).toBeInTheDocument();
    expect(screen.getByText('展开')).toBeInTheDocument();
  });

  test('does not show expand button when content is short', () => {
    const shortContentProps = {
      ...mockProps,
      contentEn: 'Short content',
      contentCh: '短内容'
    };

    render(<SocialCard {...shortContentProps} />);

    // Should not have expand button for short content
    expect(screen.queryByText('展开')).not.toBeInTheDocument();
    expect(screen.queryByText('收起')).not.toBeInTheDocument();
  });

  test('formats timestamp correctly', () => {
    render(<SocialCard {...mockProps} />);

    // Check if timestamp is formatted and displayed
    const timeElement = screen.getByText(/\/|,/); // Locale-specific date format will have either / or ,
    expect(timeElement).toBeInTheDocument();
  });

  test('displays correct platform icon', () => {
    const platforms = [
      { platform: 'twitter', icon: '🐦' },
      { platform: 'linkedin', icon: '💼' },
      { platform: 'github', icon: '🐙' },
      { platform: 'weibo', icon: '📝' },
      { platform: 'reddit', icon: '🤖' },
      { platform: 'unknown', icon: '💬' } // Should fallback to 'other' icon
    ];

    platforms.forEach(({ platform, icon }) => {
      const customProps = {
        ...mockProps,
        platform: platform,
        author: `${platform} user`
      };

      render(<SocialCard {...customProps} />);

      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });
});