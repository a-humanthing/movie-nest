# Movie Hub API

A production-ready REST API for movie management built with **NestJS**, featuring JWT authentication, MongoDB integration, and AWS S3 file management.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary with pre-signed URLs
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, input validation

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run start:dev

# Run tests
npm run test:ci
```

## 📋 Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/movie-hub

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket

# Application
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

## 🔐 Authentication

```bash
# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Use token
Authorization: Bearer <jwt-token>
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/info` | API information |
| `POST` | `/auth/login` | User login |
| `GET` | `/movies` | Get movies (paginated) |
| `POST` | `/movies` | Create movie |
| `PATCH` | `/movies/:id` | Update movie |
| `POST` | `/s3/upload-url` | Get S3 upload URL |

## 🎯 Key Features

### **Authentication & Security**
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

### **Movie Management**
- Full CRUD operations
- Pagination support
- Search and filtering capabilities
- Image upload via S3

### **File Management**
- Secure S3 integration
- Pre-signed URLs for direct uploads
- File type validation
- Automatic cleanup

### **Production Ready**
- Comprehensive error handling
- Request rate limiting
- Security headers (Helmet)
- CORS configuration
- Environment-based configuration


## 🚀 Deployment

### Docker
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB
- Set up AWS S3 credentials
- Configure CORS origins

## 📊 Project Structure

```
src/
├── auth/           # JWT authentication
├── movies/         # Movie CRUD operations
├── s3/            # AWS S3 file management
├── user/          # User management
├── common/        # Shared schemas
├── rate-limiter/  # Request throttling
└── main.ts        # Application entry
```

## 🔧 Development

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Linting
npm run lint

# Formatting
npm run format
```

## 📈 Performance

- **Database**: Indexed queries for optimal performance
- **Caching**: Redis-ready architecture
- **File Upload**: Direct S3 uploads (no server storage)
- **Security**: Rate limiting and request validation

## 🛡️ Security

- JWT token validation
- Password hashing
- Input sanitization
- CORS protection
- Security headers
- Rate limiting

## 📝 API Documentation

Interactive documentation available at `/api` when running the application.

---

**Built with NestJS, MongoDB, and AWS S3**
