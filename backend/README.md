# EcoCycle Backend API

Node.js/Express backend with MongoDB for the EcoCycle sanitation management system.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 📝 Complete CRUD operations for reports
- 👷 Worker management system
- 🚨 Emergency alert system
- 📊 Analytics and dashboard statistics
- 📸 Image upload with compression
- 📍 Geolocation support for reports
- 🔒 Role-based access control (Citizen, Worker, Admin)
- 🎭 Anonymous reporting capability
- 🛡️ Rate limiting and security headers
- ✅ Input validation

## Prerequisites

- Node.js 18+ and npm
- MongoDB 5.0+
- TypeScript

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecocycle
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:8080
```

## Development

Start development server with hot reload:
```bash
npm run dev
```

## Production

Build TypeScript:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token

### Reports
- `POST /api/reports` - Create report (supports anonymous)
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/my-reports` - Get user's reports
- `GET /api/reports/nearby` - Get nearby reports
- `GET /api/reports/:id` - Get report by ID
- `PATCH /api/reports/:id` - Update report (admin/worker)
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/assign` - Assign worker to report (admin)

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/me` - Get worker profile
- `GET /api/workers/:id` - Get worker by ID
- `GET /api/workers/:id/stats` - Get worker statistics
- `PATCH /api/workers/:id/status` - Update worker status

### Emergency Alerts
- `POST /api/emergency` - Create emergency alert
- `GET /api/emergency` - Get all emergency alerts
- `GET /api/emergency/nearby` - Get nearby alerts
- `GET /api/emergency/:id` - Get alert by ID
- `PATCH /api/emergency/:id/resolve` - Resolve alert (admin/worker)
- `DELETE /api/emergency/:id` - Delete alert (admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/reports` - Get report analytics
- `GET /api/analytics/workers` - Get worker analytics
- `GET /api/analytics/heatmap` - Get location heatmap data

## User Roles

- **Citizen**: Can create reports, view own reports, create emergency alerts
- **Worker**: All citizen permissions + update report status, view assigned reports
- **Admin**: All permissions + assign workers, delete any content, access full analytics

## File Upload

Supports image uploads for reports and emergency alerts:
- Max file size: 5MB
- Allowed types: JPEG, PNG, JPG, WEBP
- Max images per report: 5
- Images are automatically compressed

## Database Models

- **User**: User accounts with roles
- **Report**: Sanitation reports with location and images
- **Worker**: Worker profiles linked to users
- **EmergencyAlert**: Emergency alerts with severity levels
- **Session**: Refresh token sessions

## Security

- JWT access tokens (15min expiry)
- Refresh tokens (7-30 days based on "Remember Me")
- Password hashing with bcrypt
- Rate limiting on all routes
- CORS configuration
- Helmet security headers
- Input validation with express-validator

## Environment Variables

See `.env.example` for all available configuration options.
