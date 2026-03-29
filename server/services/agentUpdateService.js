// server/services/agentUpdateService.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class AgentUpdateService {
  constructor() {
    this.updateSources = [
      'https://huggingface.co/api/models/deepseek-ai/deepseek-coder-6.7b-instruct',
      'https://api.github.com/repos/microsoft/UltraInteract/releases/latest',
      'https://huggingface.co/api/models/Qwen/Qwen2.5-72B-Instruct'
    ];

    this.agents = new Map(); // 存储智能体状态
    this.updateHistory = []; // 更新历史
    this.checkInterval = 30 * 60 * 1000; // 30分钟检查一次
    this.lastCheck = new Map(); // 记录上次检查时间

    // 初始化已知智能体
    this.initializeAgents();
  }

  initializeAgents() {
    // 添加常用的AI智能体和模型
    const initialAgents = [
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        type: 'code-generation',
        version: 'v1.0',
        lastUpdated: new Date().toISOString(),
        status: 'active',
        description: '专业代码生成智能体'
      },
      {
        id: 'qwen',
        name: 'Qwen',
        type: 'general',
        version: 'v2.5-72b',
        lastUpdated: new Date().toISOString(),
        status: 'active',
        description: '通义千问大语言模型'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        type: 'general',
        version: 'turbo',
        lastUpdated: new Date().toISOString(),
        status: 'active',
        description: 'OpenAI高级推理模型'
      }
    ];

    initialAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  async checkForUpdates() {
    console.log('Checking for agent updates...');

    const results = [];

    // 检查每个更新源
    for (const source of this.updateSources) {
      try {
        const updateInfo = await this.fetchUpdateInfo(source);
        if (updateInfo) {
          results.push(updateInfo);

          // 更新智能体信息
          await this.updateAgentInfo(updateInfo);
        }
      } catch (error) {
        console.error(`Error checking update for ${source}:`, error.message);
      }
    }

    // 记录更新历史
    if (results.length > 0) {
      this.updateHistory.push({
        timestamp: new Date().toISOString(),
        updates: results
      });

      // 保持历史记录在合理范围内
      if (this.updateHistory.length > 100) {
        this.updateHistory = this.updateHistory.slice(-50);
      }
    }

    return results;
  }

  async fetchUpdateInfo(sourceUrl) {
    try {
      // 根据不同的源类型进行处理
      if (sourceUrl.includes('huggingface')) {
        return await this.fetchHuggingFaceModelInfo(sourceUrl);
      } else if (sourceUrl.includes('github')) {
        return await this.fetchGitHubReleaseInfo(sourceUrl);
      }

      // 对于其他API，尝试通用方法
      const response = await axios.get(sourceUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AI-News-Dashboard/1.0'
        }
      });

      return {
        source: sourceUrl,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to fetch update info from ${sourceUrl}:`, error.message);
      return null;
    }
  }

  async fetchHuggingFaceModelInfo(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        timeout: 10000
      });

      const modelData = response.data;

      return {
        source: 'huggingface',
        modelId: modelData.id,
        modelName: modelData.modelId || modelData.id,
        likes: modelData.likes || 0,
        downloads: modelData.downloads || 0,
        lastModified: modelData.lastModified,
        tags: modelData.tags || [],
        pipeline_tag: modelData.pipeline_tag,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Hugging Face model info:', error.message);
      return null;
    }
  }

  async fetchGitHubReleaseInfo(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        timeout: 10000
      });

      const releaseData = response.data;

      return {
        source: 'github',
        repo: releaseData.repository?.full_name || 'unknown',
        tagName: releaseData.tag_name,
        name: releaseData.name,
        publishedAt: releaseData.published_at,
        assets: releaseData.assets?.length || 0,
        downloadCount: releaseData.assets?.reduce((sum, asset) => sum + asset.download_count, 0) || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching GitHub release info:', error.message);
      return null;
    }
  }

  async updateAgentInfo(updateInfo) {
    if (!updateInfo) return;

    // 根据更新信息更新智能体状态
    let agentId;

    if (updateInfo.source === 'huggingface') {
      // 从模型ID生成智能体ID
      agentId = updateInfo.modelId.split('/').pop().toLowerCase().replace(/[-._]/g, '');
    } else if (updateInfo.source === 'github') {
      agentId = updateInfo.repo.split('/').pop().toLowerCase().replace(/[-._]/g, '');
    } else {
      agentId = 'generic-agent';
    }

    // 检查智能体是否已存在
    if (!this.agents.has(agentId)) {
      // 创建新的智能体条目
      const newAgent = {
        id: agentId,
        name: updateInfo.modelName || updateInfo.repo || agentId,
        type: this.determineAgentType(updateInfo),
        version: updateInfo.tagName || updateInfo.lastModified || 'unknown',
        lastUpdated: updateInfo.timestamp,
        status: 'active',
        description: this.generateAgentDescription(updateInfo),
        source: updateInfo.source,
        metrics: this.extractMetrics(updateInfo)
      };

      this.agents.set(agentId, newAgent);
      console.log(`New agent registered: ${agentId}`);
    } else {
      // 更新现有智能体信息
      const existingAgent = this.agents.get(agentId);
      existingAgent.version = updateInfo.tagName || updateInfo.lastModified || existingAgent.version;
      existingAgent.lastUpdated = updateInfo.timestamp;
      existingAgent.metrics = { ...existingAgent.metrics, ...this.extractMetrics(updateInfo) };

      this.agents.set(agentId, existingAgent);
      console.log(`Agent updated: ${agentId}`);
    }
  }

  determineAgentType(updateInfo) {
    // 根据更新信息确定智能体类型
    if (updateInfo.pipeline_tag) {
      if (updateInfo.pipeline_tag.includes('text-generation')) return 'language';
      if (updateInfo.pipeline_tag.includes('code')) return 'code-generation';
      if (updateInfo.pipeline_tag.includes('translation')) return 'translation';
      if (updateInfo.pipeline_tag.includes('summarization')) return 'summarization';
    }

    if (updateInfo.modelName) {
      const name = updateInfo.modelName.toLowerCase();
      if (name.includes('coder') || name.includes('code')) return 'code-generation';
      if (name.includes('chat') || name.includes('instruct')) return 'conversation';
    }

    if (updateInfo.repo) {
      const repo = updateInfo.repo.toLowerCase();
      if (repo.includes('transformers')) return 'language';
      if (repo.includes('code')) return 'code-generation';
    }

    return 'general';
  }

  generateAgentDescription(updateInfo) {
    // 根据更新信息生成智能体描述
    if (updateInfo.source === 'huggingface') {
      return `Hugging Face模型: ${updateInfo.modelName}, 点赞数: ${updateInfo.likes}, 下载数: ${updateInfo.downloads}`;
    } else if (updateInfo.source === 'github') {
      return `GitHub仓库: ${updateInfo.repo}, 版本: ${updateInfo.tagName}, 发布时间: ${updateInfo.publishedAt}`;
    }

    return 'AI智能体模型';
  }

  extractMetrics(updateInfo) {
    // 从更新信息中提取指标
    const metrics = {};

    if (updateInfo.likes !== undefined) metrics.likes = updateInfo.likes;
    if (updateInfo.downloads !== undefined) metrics.downloads = updateInfo.downloads;
    if (updateInfo.downloadCount !== undefined) metrics.downloadCount = updateInfo.downloadCount;
    if (updateInfo.assets !== undefined) metrics.assets = updateInfo.assets;

    return metrics;
  }

  getAgents(filter = {}) {
    // 获取智能体列表，支持过滤
    let agents = Array.from(this.agents.values());

    if (filter.type) {
      agents = agents.filter(agent => agent.type === filter.type);
    }

    if (filter.status) {
      agents = agents.filter(agent => agent.status === filter.status);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      agents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm)
      );
    }

    return agents;
  }

  getAgentById(agentId) {
    // 根据ID获取特定智能体
    return this.agents.get(agentId);
  }

  getRecentUpdates(limit = 10) {
    // 获取最近的更新历史
    return this.updateHistory.slice(-limit).reverse();
  }

  async simulateAgentActivity(agentId, activityType = 'inference') {
    // 模拟智能体活动，更新统计信息
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }

    // 更新活动计数器（在实际应用中，这可能是存储在数据库中的）
    if (!agent.activityStats) {
      agent.activityStats = {
        totalInferences: 0,
        lastActivity: null,
        avgResponseTime: null
      };
    }

    agent.activityStats.totalInferences += 1;
    agent.activityStats.lastActivity = new Date().toISOString();

    // 这里可以添加更复杂的统计逻辑

    this.agents.set(agentId, agent);

    return agent;
  }

  async exportAgentData(filePath) {
    // 导出智能体数据到文件
    const data = {
      agents: Array.from(this.agents.values()),
      updateHistory: this.updateHistory,
      exportedAt: new Date().toISOString()
    };

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`Agent data exported to ${filePath}`);
      return true;
    } catch (error) {
      console.error('Error exporting agent data:', error.message);
      throw error;
    }
  }

  async importAgentData(filePath) {
    // 从文件导入智能体数据
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsedData = JSON.parse(data);

      // 清空当前数据并导入新数据
      this.agents.clear();
      parsedData.agents.forEach(agent => {
        this.agents.set(agent.id, agent);
      });

      this.updateHistory = parsedData.updateHistory || [];

      console.log(`Agent data imported from ${filePath}`);
      return true;
    } catch (error) {
      console.error('Error importing agent data:', error.message);
      throw error;
    }
  }

  // 定时检查更新的方法
  startPeriodicChecks() {
    console.log(`Starting periodic agent update checks every ${this.checkInterval / 60000} minutes`);

    // 立即执行一次检查
    this.checkForUpdates().catch(error => {
      console.error('Initial agent update check failed:', error);
    });

    // 设置定时器
    setInterval(async () => {
      try {
        await this.checkForUpdates();
      } catch (error) {
        console.error('Periodic agent update check failed:', error);
      }
    }, this.checkInterval);
  }
}

module.exports = new AgentUpdateService();