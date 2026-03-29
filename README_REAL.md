# AI资讯看板

一个现代化的AI资讯聚合平台，从X平台抓取AI领域专家动态并展示智能体更新记录，支持中英双语内容展示。

## 功能特点

- **AI专家动态**：实时抓取X平台上AI领域专家的热门消息
- **智能体更新**：展示Claude Code、codex、openclaw、Antigravity等智能体的版本更新记录
- **中英双语**：自动将英文内容翻译成中文概要
- **实时更新**：社交媒体内容每分钟刷新，智能体更新每5小时刷新
- **响应式设计**：适配各种设备尺寸

## 技术架构

### 前端
- React 19.2.4
- React Hooks for state management
- Custom hooks for data fetching
- CSS Modules for styling
- Responsive design

### 后端
- Express.js
- Node.js
- Scheduled jobs with node-cron
- In-memory caching with node-cache
- API integration for translation services

## 安装与运行

### 环境要求
- Node.js 16+
- npm/yarn

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd ai-news-dashboard
```

2. 安装依赖
```bash
npm install
```

3. 创建环境变量文件
```bash
touch .env
```

4. 配置环境变量（.env）
```
OPENAI_API_KEY=your_openai_api_key_here
X_API_KEY=your_x_api_key_here
PORT=5000
NODE_ENV=development
```

5. 启动开发服务器
```bash
npm run dev
```

前端将运行在 http://localhost:3000
后端API将运行在 http://localhost:5000

### 生产环境

1. 构建前端
```bash
npm run build
```

2. 启动后端服务器
```bash
npm run start:server
```

## API端点

- `GET /api/social-content` - 获取社交媒体内容
- `POST /api/social-content/refresh` - 刷新社交媒体内容
- `POST /api/social-content/translate` - 翻译内容
- `GET /api/agent-updates` - 获取智能体更新记录
- `POST /api/agent-updates/refresh` - 刷新智能体更新记录

## 监控的专家账户

- Sam Altman (@sama)
- Dario Amodei (@DarioAmodei)
- Demis Hassabis (@demishassabis)
- Andrej Karpathy (@karpathy)
- Yann LeCun (@ylecun)
- Andrew Ng (@AndrewYNg)
- Elon Musk (@elonmusk)
- Jensen Huang (@jensenhuanxin)

## 测试

运行前端测试：
```bash
npm test
```

运行后端测试：
```bash
npm run test:server
```

运行全部测试：
```bash
npm run test:all
```

## 配置

### 定时任务配置
- 社交媒体内容刷新：每分钟
- 智能体更新检查：每5小时

可在 `server/config/index.js` 中调整配置。

### 过滤选项
- 时间范围：最近1小时、6小时、24小时、一周
- 智能体筛选：可选择特定智能体更新类型
- 搜索：关键词搜索功能

## 代码结构

```
src/
├── components/     # React组件
├── services/       # API服务和数据处理
├── utils/          # 工具函数和常量
├── hooks/          # 自定义React Hooks
└── App.css         # 主样式文件

server/
├── routes/         # API路由
├── controllers/    # API控制器
├── services/       # 业务逻辑服务
├── utils/          # 工具函数
└── config/         # 配置文件
```

## 贡献

欢迎提交Issue和Pull Request来改进此项目。