# AI News Dashboard

A comprehensive dashboard for tracking AI news and updates from various social platforms and AI agent activities.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features
- Real-time AI news feed from multiple social platforms (Twitter, Reddit, Hacker News)
- AI agent activity monitoring with status indicators
- Content filtering by platform, language, and date range
- Responsive design for desktop and mobile devices
- Performance optimized with React hooks and efficient state management
- Security features including rate limiting and helmet protection

## Technologies Used
- **Frontend**: React 19, JavaScript ES6+, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest, React Testing Library
- **Development**: Nodemon, Concurrently
- **Security**: Helmet, CORS, Rate Limiter
- **UI Components**: Custom built with CSS Flexbox/Grid

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-news-dashboard.git
   cd ai-news-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-news-dashboard
   CORS_ORIGIN=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=15 * 60 * 1000
   RATE_LIMIT_MAX_REQUESTS=100
   API_KEY=your_api_key_here
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Usage

### Development
To run both client and server in development mode:
```bash
npm run dev
```

To run only the backend server:
```bash
npm run dev:server
```

To run only the frontend client:
```bash
npm run dev:client
```

### Production
To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm run server
```

### Testing
To run the test suite:
```bash
npm test
```

### Formatting and Linting
To format the code:
```bash
npm run format
```

To check linting issues:
```bash
npm run lint
```

To fix linting issues automatically:
```bash
npm run lint:fix
```

### Deployment
To analyze the bundle size:
```bash
npm run analyze
```

## Project Structure
```
ai-news-dashboard/
├── public/                 # Public assets
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   │   ├── SocialContentCard.js     # Social media content display
│   │   ├── SocialContentCard.css    # Styling for social cards
│   │   ├── AgentUpdateCard.js       # AI agent update display
│   │   ├── AgentUpdateCard.css      # Styling for agent updates
│   │   ├── AgentUpdatesFeed.js      # Feed of agent updates
│   │   └── AgentUpdatesFeed.css     # Styling for agent feed
│   ├── hooks/              # Custom React hooks
│   │   ├── useSocialData.js         # Hook for social data
│   │   └── useAgentUpdates.js       # Hook for agent updates
│   ├── services/           # API services
│   │   └── api.js          # API endpoints
│   ├── utils/              # Utility functions
│   │   └── dateUtils.js    # Date utilities
│   ├── App.js              # Main application component
│   ├── App.css             # Global application styles
│   └── index.js            # Application entry point
├── server/                 # Backend source code
│   ├── app.js              # Main Express application
│   ├── routes/             # API routes
│   │   ├── socialRoutes.js # Social media endpoints
│   │   └── agentRoutes.js  # AI agent endpoints
│   ├── controllers/        # Route controllers
│   │   ├── socialController.js  # Social media handlers
│   │   └── agentController.js   # AI agent handlers
│   ├── models/             # Database models
│   │   ├── SocialPost.js   # Social post model
│   │   └── AgentUpdate.js  # Agent update model
│   └── utils/              # Backend utilities
│       └── validation.js   # Validation helpers
├── .env.example           # Example environment variables
├── .gitignore             # Git ignored files
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
└── ...
```

## API Endpoints

### Social Media Data
- `GET /api/social/posts` - Get social media posts with filtering options
  - Query params: `platform`, `language`, `startDate`, `endDate`, `limit`, `page`

### Agent Updates
- `GET /api/agents/updates` - Get AI agent updates with filtering options
  - Query params: `status`, `agentName`, `startDate`, `endDate`, `limit`, `page`

## Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ai-news-dashboard |
| `CORS_ORIGIN` | Allowed origin for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Time window for rate limiting | 900000 (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per IP in rate limit window | 100 |
| `API_KEY` | API key for protected endpoints | (none) |

## Deployment

### Deploy to Heroku
1. Login to Heroku CLI:
   ```bash
   heroku login
   heroku container:login
   ```

2. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongo_uri
   heroku config:set API_KEY=your_api_key
   # ... other environment variables
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Netlify/Vercel (Frontend Only)
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Netlify or Vercel following their documentation.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Run tests (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License
This project is licensed under the MIT License.# ai-news-dashboard
