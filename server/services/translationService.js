// server/services/translationService.js
const axios = require('axios');

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30分钟缓存
    this.translationProvider = process.env.TRANSLATION_PROVIDER || 'google'; // 可选 google, azure, deepseek
  }

  async translateText(text, targetLang = 'zh', sourceLang = 'en') {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided for translation');
    }

    // 检查缓存
    const cacheKey = `${sourceLang}_${targetLang}_${text.substring(0, 50)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Cache hit for translation: ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`Translating text from ${sourceLang} to ${targetLang}`);

      let translatedText;

      switch(this.translationProvider.toLowerCase()) {
        case 'azure':
          translatedText = await this.translateWithAzure(text, targetLang, sourceLang);
          break;
        case 'deepseek':
          translatedText = await this.translateWithDeepSeek(text, targetLang, sourceLang);
          break;
        case 'google':
        default:
          translatedText = await this.translateWithGoogle(text, targetLang, sourceLang);
          break;
      }

      // 缓存翻译结果
      this.cache.set(cacheKey, {
        data: translatedText,
        timestamp: Date.now()
      });

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  async translateWithGoogle(text, targetLang, sourceLang) {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not set');
    }

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLang,
        source: sourceLang,
        format: 'text'
      }
    );

    return response.data.data.translations[0].translatedText;
  }

  async translateWithAzure(text, targetLang, sourceLang) {
    const subscriptionKey = process.env.AZURE_TRANSLATE_SUBSCRIPTION_KEY;
    const region = process.env.AZURE_TRANSLATE_REGION || 'global';

    if (!subscriptionKey) {
      throw new Error('AZURE_TRANSLATE_SUBSCRIPTION_KEY is not set');
    }

    const response = await axios.post(
      `https://${region}.api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLang}&to=${targetLang}`,
      [{
        Text: text
      }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data[0].translations[0].text;
  }

  async translateWithDeepSeek(text, targetLang, sourceLang) {
    // DeepSeek提供免费的高质量翻译API
    // 这是一个示例实现，实际集成可能需要调整
    console.log('Using DeepSeek translation provider');

    // 这里假设使用类似OpenAI的接口
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not set');
    }

    // 在实际应用中，这里会调用DeepSeek的翻译API
    // 目前只是一个占位符实现
    try {
      // 简单模拟翻译过程
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text, no explanations.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.warn('DeepSeek translation failed, falling back to Google Translate');
      // 如果DeepSeek失败，则回退到Google翻译
      return await this.translateWithGoogle(text, targetLang, sourceLang);
    }
  }

  // 批量翻译文本
  async translateBatch(texts, targetLang = 'zh', sourceLang = 'en') {
    if (!Array.isArray(texts)) {
      throw new Error('texts must be an array');
    }

    const results = [];
    for (const text of texts) {
      const translated = await this.translateText(text, targetLang, sourceLang);
      results.push(translated);
    }

    return results;
  }

  // 翻译文章对象
  async translateArticle(article, targetLang = 'zh') {
    if (!article || !article.title) {
      throw new Error('Invalid article object provided');
    }

    const translatedArticle = { ...article };

    // 翻译标题
    if (article.title) {
      translatedArticle.title = await this.translateText(article.title, targetLang, 'auto');
    }

    // 翻译摘要
    if (article.summary) {
      translatedArticle.summary = await this.translateText(article.summary, targetLang, 'auto');
    }

    // 翻译正文片段（如果存在）
    if (article.content) {
      translatedArticle.content = await this.translateText(article.content, targetLang, 'auto');
    }

    // 翻译关键词（如果存在）
    if (article.keywords && Array.isArray(article.keywords)) {
      translatedArticle.keywords = await this.translateBatch(article.keywords, targetLang, 'auto');
    }

    return translatedArticle;
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

module.exports = new TranslationService();