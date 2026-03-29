/**
 * 应用常量定义
 */

// API 端点相关常量
export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  AGENTS: '/api/agents',
  FEEDS: '/api/feeds',
  SEARCH: '/api/search',
  RECOMMENDATIONS: '/api/recommendations'
};

// 文章类型常量
export const ARTICLE_TYPES = {
  NEWS: 'news',
  BLOG: 'blog',
  TWEET: 'tweet',
  FORUM_POST: 'forum_post',
  TECHNICAL_PAPER: 'technical_paper'
};

// 社交平台常量
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  REDDIT: 'reddit',
  HACKER_NEWS: 'hacker_news',
  DISCORD: 'discord',
  LINKEDIN: 'linkedin',
  GITHUB: 'github'
};

// 数据源常量
export const DATA_SOURCES = {
  RSS_FEEDS: 'rss_feeds',
  SOCIAL_MEDIA: 'social_media',
  NEWS_API: 'news_api',
  CUSTOM_INTEGRATIONS: 'custom_integrations'
};

// 默认分页设置
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// 颜色主题
export const THEME_COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  INFO: '#17a2b8',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};

// 组件尺寸常量
export const SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg'
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请稍后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
  INVALID_INPUT: '输入参数无效',
  RESOURCE_NOT_FOUND: '资源未找到',
  UNAUTHORIZED: '未授权访问，请重新登录',
  RATE_LIMIT_EXCEEDED: '请求过于频繁，请稍后重试'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  OPERATION_SUCCESS: '操作成功',
  DATA_UPDATED: '数据更新成功',
  SUBMISSION_SUCCESS: '提交成功'
};

// 本地存储键名
export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
  LAST_SEARCH_QUERY: 'last_search_query',
  FILTER_SETTINGS: 'filter_settings',
  VIEWED_ARTICLES: 'viewed_articles'
};

// 事件类型
export const EVENT_TYPES = {
  ARTICLE_CLICK: 'article_click',
  ARTICLE_SHARE: 'article_share',
  ARTICLE_SAVE: 'article_save',
  SEARCH_EXECUTE: 'search_execute',
  FILTER_CHANGE: 'filter_change',
  PAGE_VIEW: 'page_view'
};

// 时间范围
export const TIME_RANGES = {
  LAST_HOUR: 'last_hour',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  ALL_TIME: 'all_time'
};