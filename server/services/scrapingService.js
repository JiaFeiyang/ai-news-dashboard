// server/services/scrapingService.js
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

class ScrapingService {
  constructor() {
    // X平台API配置
    this.twitterClient = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET
    });

    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
  }

  async scrapeXData(query, maxResults = 50) {
    const cacheKey = `x_data_${query}_${maxResults}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Cache hit for ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`Fetching X data for query: ${query}`);

      // 使用Twitter API搜索推文
      const tweets = await this.twitterClient.v2.search(query, {
        max_results: maxResults,
        'tweet.fields': 'created_at,author_id,public_metrics',
        'user.fields': 'name,username,verified,followers_count'
      });

      const processedTweets = [];
      for await (const tweet of tweets) {
        if (tweet.public_metrics?.retweet_count > 10 || tweet.public_metrics?.like_count > 50) {
          // 获取对应的用户信息
          let user;
          try {
            user = await this.twitterClient.v2.user(tweet.author_id, {
              'user.fields': 'name,username,verified,followers_count'
            });
          } catch (error) {
            console.error(`Failed to fetch user ${tweet.author_id}:`, error.message);
            continue;
          }

          processedTweets.push({
            id: tweet.id,
            text: tweet.text,
            createdAt: tweet.created_at,
            author: {
              id: user.data.id,
              name: user.data.name,
              username: user.data.username,
              verified: user.data.verified,
              followersCount: user.data.followers_count
            },
            metrics: tweet.public_metrics,
            source: 'x'
          });
        }
      }

      const result = {
        platform: 'x',
        query: query,
        timestamp: new Date().toISOString(),
        data: processedTweets
      };

      // 缓存结果
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Error scraping X data:', error);
      throw new Error(`Failed to scrape X data: ${error.message}`);
    }
  }

  // 清除过期缓存
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = new ScrapingService();