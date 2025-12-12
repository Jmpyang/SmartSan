# EcoCycle

EcoCycle is a scalable, community-centered sanitation management system that leverages mobile technology, IoT integration, and AI-powered analytics to improve public sanitation services. It enables real-time issue reporting, predictive maintenance, and data-driven decision-making for sanitation workers, administrators, and the community.

### Environment Variables
Create a `.env` file in the root directory (or `.env.local` for local development overrides):

**Frontend (`VITE_` prefix required)**
```env
VITE_API_URL=http://localhost:5000 # Development (handled by proxy, leave empty or set explicitly)
# VITE_API_URL=https://your-backend-url.com # Production
```

**Backend**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
```

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- 🎨 Modern, responsive UI with Tailwind CSS & shadcn/ui
- 📱 Mobile-first design
- 🗺️ Interactive maps for location tracking
- 📊 Real-time analytics dashboard
- 🌙 Dark mode support
- 🔔 Toast notifications

### Backend (Node.js + Express + MongoDB)
- 🔐 JWT authentication with refresh tokens
- 👥 Role-based access control (Citizen, Worker, Admin)
- 📝 Complete CRUD operations for reports
- 🎭 Anonymous reporting capability
- 📸 Image upload with automatic compression
- 📍 Geolocation support
- 🚨 Emergency alert system
- 👷 Worker management
- 📊 Analytics and statistics
- 🛡️ Rate limiting and security headers

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB 5.0+
- Git

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd SmartSan
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Set up MongoDB
Make sure MongoDB is running on your system:
```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Configure Backend
The backend `.env` file is already created with development defaults. Update if needed:
```bash
cd backend
# Edit .env file with your configuration
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Start Frontend Development Server
```bash
# In the root directory
npm run dev
```
Frontend will run on http://localhost:8080

## 📚 API Documentation

The backend API is available at `http://localhost:5000/api`

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Reports
- `POST /api/reports` - Create report (anonymous supported)
- `GET /api/reports` - Get all reports
- `GET /api/reports/my-reports` - Get user's reports
- `GET /api/reports/nearby?longitude=X&latitude=Y` - Get nearby reports

#### Emergency
- `POST /api/emergency` - Create emergency alert
- `GET /api/emergency` - Get emergency alerts

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/heatmap` - Location heatmap

See `backend/README.md` for complete API documentation.

## 👤 User Roles

### Citizen
- Create and view reports
- Upload images
- Report issues anonymously
- Create emergency alerts
- View own reports

### Worker
- All Citizen permissions
- Update report status
- View assigned reports
- Update work status

### Admin
- All Worker permissions
- Assign reports to workers
- Access full analytics
- Manage users
- Delete any content

## 🔒 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## 🗂️ Project Structure

```
SmartSan/
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Entry point
│   ├── uploads/           # Uploaded files
│   └── package.json
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── public/               # Static assets
└── package.json
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when configured)
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI components from shadcn/ui
- Backend powered by Express and MongoDB
- Icons from Lucide React
