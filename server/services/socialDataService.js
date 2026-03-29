// server/services/socialDataService.js
const scrapingService = require('./scrapingService');
const translationService = require('./translationService');
const agentUpdateService = require('./agentUpdateService');

class SocialDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10分钟缓存
  }

  async processSocialData(query, options = {}) {
    const {
      translateTo = 'zh',
      includeSentiment = true,
      includeSummarization = true,
      maxResults = 50,
      sourcePlatforms = ['x'] // 当前主要支持X平台
    } = options;

    const cacheKey = `social_data_${query}_${translateTo}_${maxResults}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Cache hit for social data: ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`Processing social data for query: ${query}`);

      // 从各平台收集数据
      const socialData = {
        query: query,
        timestamp: new Date().toISOString(),
        platforms: {}
      };

      // 处理X平台数据
      if (sourcePlatforms.includes('x')) {
        try {
          const xData = await scrapingService.scrapeXData(query, maxResults);
          socialData.platforms.x = xData;

          // 更新智能体活动统计
          await agentUpdateService.simulateAgentActivity('x-data-scraper', 'scraping');
        } catch (error) {
          console.error('Error scraping X data:', error.message);
          socialData.platforms.x = { error: error.message, data: [] };
        }
      }

      // 处理所有社交数据以进行进一步分析
      const processedData = await this.processRawSocialData(socialData, {
        translateTo,
        includeSentiment,
        includeSummarization
      });

      // 缓存结果
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;
    } catch (error) {
      console.error('Error processing social data:', error);
      throw new Error(`Failed to process social data: ${error.message}`);
    }
  }

  async processRawSocialData(socialData, options = {}) {
    const { translateTo, includeSentiment, includeSummarization } = options;

    // 收集所有待处理的文本内容
    const allTexts = [];

    // 从X平台数据中提取文本
    if (socialData.platforms.x && socialData.platforms.x.data) {
      socialData.platforms.x.data.forEach(post => {
        if (post.text) {
          allTexts.push({
            platform: 'x',
            id: post.id,
            text: post.text,
            originalPost: post
          });
        }
      });
    }

    // 如果需要翻译，翻译所有文本
    if (translateTo && translateTo !== 'original') {
      for (const item of allTexts) {
        try {
          item.translatedText = await translationService.translateText(item.text, translateTo);
        } catch (error) {
          console.warn(`Translation failed for post ${item.id}:`, error.message);
          item.translatedText = item.text; // 回退到原文
        }
      }

      // 同样翻译查询词
      try {
        socialData.translatedQuery = await translationService.translateText(socialData.query, translateTo);
      } catch (error) {
        console.warn('Query translation failed:', error.message);
        socialData.translatedQuery = socialData.query;
      }
    }

    // 应用情感分析（如果需要）
    if (includeSentiment) {
      await this.addSentimentAnalysis(allTexts);
    }

    // 应用总结（如果需要）
    if (includeSummarization) {
      await this.addSummarization(socialData, allTexts);
    }

    // 更新处理后的数据到socialData对象
    if (socialData.platforms.x && socialData.platforms.x.data) {
      socialData.platforms.x.data = socialData.platforms.x.data.map(post => {
        const matchedItem = allTexts.find(item => item.id === post.id);
        if (matchedItem) {
          return {
            ...post,
            ...(matchedItem.translatedText && { translatedText: matchedItem.translatedText }),
            ...(matchedItem.sentiment && { sentiment: matchedItem.sentiment }),
            ...(matchedItem.summary && { summary: matchedItem.summary })
          };
        }
        return post;
      });
    }

    // 计算聚合统计信息
    socialData.aggregatedStats = this.calculateAggregatedStats(socialData);

    return socialData;
  }

  async addSentimentAnalysis(textItems) {
    // 模拟情感分析功能
    // 在实际实现中，这里会调用专门的情感分析API或模型
    for (const item of textItems) {
      try {
        // 这里我们简单地基于一些关键词来判断情感倾向
        const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'fantastic', 'wonderful', 'perfect'];
        const negativeKeywords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'disappointing', 'worst', 'sad', 'angry'];

        const textLower = item.text.toLowerCase();
        const positiveCount = positiveKeywords.filter(keyword => textLower.includes(keyword)).length;
        const negativeCount = negativeKeywords.filter(keyword => textLower.includes(keyword)).length;

        let sentimentScore = 0;
        if (positiveCount > negativeCount) {
          sentimentScore = Math.min(1, positiveCount / (positiveCount + negativeCount || 1));
        } else if (negativeCount > positiveCount) {
          sentimentScore = -Math.min(1, negativeCount / (positiveCount + negativeCount || 1));
        }

        let sentimentLabel = 'neutral';
        if (sentimentScore > 0.3) sentimentLabel = 'positive';
        else if (sentimentScore < -0.3) sentimentLabel = 'negative';

        item.sentiment = {
          label: sentimentLabel,
          score: sentimentScore,
          positiveKeywords: positiveKeywords.filter(keyword => textLower.includes(keyword)),
          negativeKeywords: negativeKeywords.filter(keyword => textLower.includes(keyword))
        };
      } catch (error) {
        console.error(`Sentiment analysis failed for item ${item.id}:`, error.message);
        item.sentiment = { label: 'unknown', score: 0 };
      }
    }
  }

  async addSummarization(socialData, textItems) {
    // 模拟内容总结功能
    // 在实际实现中，这里会调用专门的总结模型或API

    // 总结整个话题
    try {
      const allTextContent = textItems.map(item => item.text).join(' ... ');

      // 截取前500个字符作为样本进行总结
      const sampleText = allTextContent.substring(0, 500);

      // 简单的关键词提取作为主题总结
      const keywords = this.extractKeywords(sampleText);
      socialData.topicSummary = {
        mainKeywords: keywords.slice(0, 10),
        totalPosts: textItems.length,
        estimatedTopic: this.estimateTopic(keywords)
      };
    } catch (error) {
      console.error('Topic summarization failed:', error.message);
      socialData.topicSummary = { error: error.message };
    }

    // 为每项内容添加简短总结（如果内容足够长）
    for (const item of textItems) {
      if (item.text.length > 100) {
        try {
          // 简单的首句提取作为总结
          const sentences = item.text.match(/[^\.!?]+[\.!?]+/g) || [item.text];
          item.summary = sentences[0].trim();
        } catch (error) {
          console.error(`Summarization failed for item ${item.id}:`, error.message);
          item.summary = item.text.substring(0, 100) + '...';
        }
      }
    }
  }

  extractKeywords(text) {
    // 简单的关键词提取（在实际应用中应使用更复杂的NLP技术）
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    // 计算词频
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // 按频率排序并返回前20个
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  estimateTopic(keywords) {
    // 基于关键词估计话题
    const topicIndicators = {
      technology: ['tech', 'software', 'ai', 'programming', 'code', 'app', 'digital', 'web', 'computer', 'mobile'],
      business: ['business', 'company', 'market', 'finance', 'money', 'investment', 'startup', 'entrepreneur', 'economic', 'trade'],
      politics: ['politics', 'government', 'election', 'policy', 'vote', 'president', 'congress', 'senate', 'law', 'political'],
      health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'treatment', 'medicine', 'patient', 'care', 'wellness'],
      sports: ['sport', 'game', 'team', 'player', 'match', 'win', 'score', 'championship', 'football', 'basketball'],
      entertainment: ['movie', 'music', 'celebrity', 'film', 'show', 'actor', 'actress', 'song', 'concert', 'entertainment']
    };

    const topicScores = {};
    for (const [topic, indicators] of Object.entries(topicIndicators)) {
      topicScores[topic] = indicators.filter(indicator =>
        keywords.some(kw => kw.includes(indicator) || indicator.includes(kw))
      ).length;
    }

    const topTopic = Object.entries(topicScores)
      .sort(([,a], [,b]) => b - a)[0];

    return topTopic[1] > 0 ? topTopic[0] : 'general';
  }

  calculateAggregatedStats(socialData) {
    // 计算聚合统计数据
    let totalPosts = 0;
    let totalEngagement = 0;
    let positiveSentimentCount = 0;
    let negativeSentimentCount = 0;
    let neutralSentimentCount = 0;

    // 统计X平台数据
    if (socialData.platforms.x && socialData.platforms.x.data) {
      for (const post of socialData.platforms.x.data) {
        totalPosts++;

        // 计算参与度（喜欢数+转发数+回复数）
        if (post.metrics) {
          totalEngagement += (post.metrics.like_count || 0) +
                            (post.metrics.retweet_count || 0) +
                            (post.metrics.reply_count || 0);
        }

        // 统计情感分析结果
        if (post.sentiment) {
          if (post.sentiment.label === 'positive') positiveSentimentCount++;
          else if (post.sentiment.label === 'negative') negativeSentimentCount++;
          else neutralSentimentCount++;
        }
      }
    }

    return {
      totalPosts,
      totalEngagement,
      averageEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
      sentimentDistribution: {
        positive: positiveSentimentCount,
        negative: negativeSentimentCount,
        neutral: neutralSentimentCount
      },
      sentimentRatio: {
        positive: totalPosts > 0 ? positiveSentimentCount / totalPosts : 0,
        negative: totalPosts > 0 ? negativeSentimentCount / totalPosts : 0,
        neutral: totalPosts > 0 ? neutralSentimentCount / totalPosts : 0
      }
    };
  }

  async getTrendingTopics(options = {}) {
    // 获取趋势话题
    const { limit = 10, timeframe = '24h', region = 'global' } = options;

    // 在实际应用中，这里会调用真实的趋势API
    // 这里我们返回模拟数据
    const mockTrends = [
      { name: '#AIDevelopment', query: 'AI development', volume: 150000 },
      { name: '#TechInnovation', query: 'tech innovation', volume: 120000 },
      { name: '#MachineLearning', query: 'machine learning', volume: 100000 },
      { name: '#OpenSource', query: 'open source', volume: 85000 },
      { name: '#FutureTech', query: 'future tech', volume: 75000 }
    ];

    return mockTrends.slice(0, limit);
  }

  async getDetailedSocialInsights(query, options = {}) {
    // 获取详细的社交洞察
    const socialData = await this.processSocialData(query, options);

    // 计算额外的洞察
    const insights = {
      ...socialData.aggregatedStats,
      topicTrend: this.estimateTopicTrend(socialData),
      influentialAccounts: this.findInfluentialAccounts(socialData),
      keyThemes: socialData.topicSummary?.mainKeywords || [],
      recommendedActions: this.generateRecommendations(socialData)
    };

    return {
      data: socialData,
      insights: insights
    };
  }

  estimateTopicTrend(socialData) {
    // 估算话题趋势
    // 在实际应用中，这里会分析时间序列数据
    // 这里返回模拟值
    return {
      trendDirection: 'up', // up, down, stable
      growthRate: 12.5, // 百分比
      momentum: 0.7 // 0-1的动量分数
    };
  }

  findInfluentialAccounts(socialData) {
    // 查找有影响力的账户
    const accounts = [];

    if (socialData.platforms.x && socialData.platforms.x.data) {
      // 按关注者数量和参与度排序
      const sortedPosts = [...socialData.platforms.x.data]
        .sort((a, b) => {
          const engagementA = (a.metrics?.like_count || 0) + (a.metrics?.retweet_count || 0);
          const engagementB = (b.metrics?.like_count || 0) + (b.metrics?.retweet_count || 0);
          return engagementB - engagementA; // 降序排列
        });

      // 提取独特的账户信息
      const accountMap = new Map();
      for (const post of sortedPosts) {
        if (post.author) {
          if (!accountMap.has(post.author.id)) {
            accountMap.set(post.author.id, {
              ...post.author,
              totalEngagement: 0,
              postCount: 0
            });
          }

          const account = accountMap.get(post.author.id);
          account.totalEngagement += (post.metrics?.like_count || 0) + (post.metrics?.retweet_count || 0);
          account.postCount++;
        }
      }

      // 按参与度排序并返回前几个
      accounts.push(...Array.from(accountMap.values())
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5));
    }

    return accounts;
  }

  generateRecommendations(socialData) {
    // 生成推荐行动
    const recommendations = [];

    // 基于情感分析结果的推荐
    const sentimentRatio = socialData.aggregatedStats?.sentimentRatio || {};
    if (sentimentRatio.negative > 0.3) {
      recommendations.push({
        type: 'monitor',
        priority: 'high',
        description: '负面情绪比例较高，建议密切关注舆论发展',
        action: '设置更频繁的监控提醒'
      });
    }

    if (sentimentRatio.positive > 0.6) {
      recommendations.push({
        type: 'engage',
        priority: 'medium',
        description: '正面情绪占主导，可考虑加大相关营销投入',
        action: '制定相关话题营销策略'
      });
    }

    // 基于参与度的推荐
    const avgEngagement = socialData.aggregatedStats?.averageEngagement || 0;
    if (avgEngagement > 100) {
      recommendations.push({
        type: 'leverage',
        priority: 'high',
        description: '平均参与度高，该话题有成为热门的潜力',
        action: '增加相关内容产出'
      });
    }

    return recommendations;
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

module.exports = new SocialDataService();