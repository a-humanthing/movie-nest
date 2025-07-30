# Movie Hub API

A comprehensive movie management API built with NestJS, featuring JWT authentication, MongoDB integration, and S3 file management.

## 🚀 Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Movie Management**: Full CRUD operations with pagination
- **File Management**: S3 integration for file uploads and management
- **User Management**: User profiles and account management
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Validation**: Comprehensive input validation and error handling
- **Security**: JWT authentication, CORS protection, and secure file handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- AWS S3 (for file storage)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nest-movie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/movie-hub
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # AWS S3
   S3_REGION=us-east-1
   S3_ACCESS_KEY_ID=your-s3-access-key
   S3_SECRET_ACCESS_KEY=your-s3-secret-key
   S3_BUCKET_NAME=your-s3-bucket-name
   
   # Application
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

The API documentation is available via Swagger UI at:
- **Development**: http://localhost:3000/api
- **Production**: https://your-domain.com/api

### Interactive Documentation Features

- **Try it out**: Test endpoints directly from the browser
- **Authentication**: JWT token management with persistent authorization
- **Request/Response Examples**: Detailed examples for all endpoints
- **Error Codes**: Comprehensive error documentation
- **Schema Validation**: Automatic validation of request/response schemas

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication.

### Authentication Flow

1. **Login**: POST `/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "rememberMe": false
   }
   ```

2. **Use Access Token**: Include in Authorization header
   ```
   Authorization: Bearer <your-jwt-token>
   ```

3. **Refresh Token**: POST `/auth/refresh` (automatic via cookies)

4. **Logout**: POST `/auth/logout`

## 📖 API Endpoints

### System Endpoints
- `GET /` - Health check
- `GET /info` - API information

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Movie Management Endpoints
- `GET /movies` - Get all movies (paginated)
- `POST /movies` - Create a new movie
- `PATCH /movies/:id` - Update a movie

### File Management Endpoints
- `POST /s3/upload-url` - Get signed URL for file upload
- `DELETE /s3/files/:key` - Delete file from S3

## 🎬 Movie Management

### Movie Schema
```typescript
{
  title: string;           // Movie title
  publishingYear: number;  // Release year
  posterUrl: string;       // Poster image URL
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Pagination
Movie endpoints support pagination:
```
GET /movies?page=1&limit=10
```

Response includes:
- `movies`: Array of movie objects
- `page`: Current page number
- `limit`: Items per page
- `total`: Total number of movies
- `totalPages`: Total number of pages

## 📁 File Management

### S3 Integration
The API integrates with AWS S3 for file storage:

1. **Get Upload URL**: Request a pre-signed URL for direct S3 upload
2. **Upload File**: Upload directly to S3 using the signed URL
3. **Delete File**: Remove files from S3 storage

### File Upload Flow
```javascript
// 1. Get signed URL
const response = await fetch('/s3/upload-url', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({
    fileName: 'movie-poster.jpg',
    fileType: 'image/jpeg'
  })
});

// 2. Upload to S3
const { url } = await response.json();
await fetch(url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' }
});
```

## 🔧 Development

### Project Structure
```
src/
├── auth/           # Authentication module
├── movies/         # Movie management module
├── s3/            # File management module
├── user/          # User management module
├── common/        # Shared schemas and utilities
├── app.controller.ts
├── app.module.ts
└── main.ts
```

### Available Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```env
MONGO_URI=mongodb://your-mongo-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
S3_REGION=your-s3-region
S3_ACCESS_KEY_ID=your-s3-access-key
S3_SECRET_ACCESS_KEY=your-s3-secret-key
S3_BUCKET_NAME=your-s3-bucket
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Automatic token refresh mechanism
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data
- **Rate Limiting**: Built-in request rate limiting
- **HTTPS**: Production-ready with SSL/TLS support

## 📝 API Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api`
- Review the health check endpoint at `/`
- Check the API information endpoint at `/info`

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete CRUD operations for movies
- JWT authentication system
- S3 file management integration
- Comprehensive Swagger documentation
- Pagination support
- Error handling and validation
