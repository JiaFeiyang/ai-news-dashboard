# AI社交媒体内容看板设计文档

## 项目概述
构建一个现代化的AI资讯看板，专门用于聚合和展示社交媒体平台上与AI相关的讨论内容。采用卡片式流布局，为用户提供直观、实时的AI社区动态概览。

## 设计目标
- 从X平台抓取AI领域知名专家的热门消息，包括：Sam Altman、Dario Amodei、Demis Hassabis、Andrej Karpathy、Yann LeCun、Andrew Ng、Elon Musk、Jensen Huang
- 自动将英文内容翻译成中文概要，并提供原文链接
- 提供Claude Code、codex、openclaw、Antigravity智能体的版本更新记录
- 提供清晰的视觉层次和易读的布局
- 支持实时内容刷新
- 提供筛选和排序功能
- 响应式设计，支持多种设备

## 架构设计
### 前端架构
- 使用React作为主要框架
- 使用React Router进行路由管理
- 使用Axios进行API请求
- 使用Context API进行状态管理
- 使用CSS Modules或styled-components进行样式管理

### 后端架构（Mock API Server）
- 使用Express.js构建API服务
- 集成OpenAI或Google Translate API进行英文到中文的翻译
- 社交媒体爬虫模块（用于抓取X平台特定账户的公开内容）
- 定时任务模块（定时刷新数据）

### 组件结构
```
App
├── Header
├── Filters
├── ContentTabs (社交媒体内容/智能体更新)
├── SocialCardFeed
│   ├── SocialCard
│   │   ├── CardHeader
│   │   ├── CardBody (英文原文 + 中文概要)
│   │   └── CardFooter
│   └── LoadMoreButton
├── AgentUpdatesFeed
│   └── AgentUpdateCard
└── Footer
```

### 主要组件设计

#### SocialCard组件
- 专家头像和姓名（Sam Altman、Dario Amodei、Demis Hassabis、Andrej Karpathy、Yann LeCun、Andrew Ng、Elon Musk、Jensen Huang）
- 帖子原始语言及翻译后的中文概要
- 原始帖子链接
- 发布时间（相对时间显示）
- 互动数据（点赞数、转发数、评论数）
- 原平台标识（X平台）
- 可选：原文引用框（显示原始英文内容）

#### AgentUpdates组件
- 智能体名称标识（Claude Code、codex、openclaw、Antigravity）
- 版本号显示
- 更新时间
- 更新内容描述
- 更新类型标签（功能新增、错误修复、性能改进等）
- 查看详情链接

#### Header组件
- 看板标题
- 刷新按钮
- 实时更新指示器

#### Filters组件
- 时间范围筛选（最近1小时、6小时、24小时等）
- 平台来源筛选
- 智能体选择筛选
- 关键词搜索框
- 排序选项（最新、最热、最多互动）

## 数据流设计
1. 应用启动时从API加载最近的社交媒体内容和智能体更新记录
2. 后端定时（每分钟）抓取X平台上指定专家账户（Sam Altman、Dario Amodei、Demis Hassabis、Andrej Karpathy、Yann LeCun、Andrew Ng、Elon Musk、Jensen Huang）的公开帖子
3. 对英文内容进行中文翻译处理，生成中文概要
4. 用户操作（筛选、排序）触发条件查询
5. 点击加载更多加载历史内容
6. 智能体更新数据每5小时刷新一次

## API接口设计
- `/api/social-content` - 获取社交媒体内容列表
- 参数：limit, offset, platform, time_range, sort_order, search_term, accounts (特定账号列表)
- `/api/social-content/refresh` - 强制刷新社交媒体内容
- `/api/agent-updates` - 获取智能体版本更新记录
- 参数：agents (Claude Code|codex|openclaw|Antigravity), time_range, limit
- `/api/agent-updates/refresh` - 强制检查智能体更新
- `/api/social-content/translate` - 翻译英文内容为中文概要
- `/api/social-content/stats` - 获取社交媒体统计信息
- `/api/agent-updates/stats` - 获取智能体更新统计信息

## 视觉设计
### 颜色方案
- 主色调：科技蓝 (#2E86AB)
- 辅助色：灰色系 (#6A6A6A, #F5F5F5)
- 状态色：红色（警示）、绿色（成功）

### 字体方案
- 主标题：Roboto Bold
- 正文：Roboto Regular
- 日期/元信息：Roboto Light

### 响应式断点
- 手机：最大宽度480px
- 平板：481px至1024px
- 桌面：1025px及以上

## 性能优化
- 虚拟滚动处理大量卡片
- 图片懒加载
- API响应缓存（社交媒体内容短期缓存，智能体更新长期缓存）
- 防抖处理用户输入
- 分别设置不同内容类型的刷新频率（社交媒体高频，智能体更新低频）

## 测试策略
- 单元测试：React组件、工具函数
- 集成测试：API连接、数据流
- 用户界面测试：关键用户流程