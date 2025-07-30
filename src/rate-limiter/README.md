# Rate Limiter Implementation

This module provides a comprehensive rate limiting solution for the NestJS application using global middleware.

## Features

- **Global Rate Limiting**: Applied to all routes via middleware
- **IP-based Tracking**: Tracks requests by client IP address
- **Configurable Limits**: Different limits for different route types
- **Rate Limit Headers**: Provides standard rate limit headers in responses

## Components

### 1. RateLimitService
Core service that handles rate limit checking and storage.

### 2. RateLimitMiddleware
Global middleware that applies rate limiting to all routes.

## Usage

### Global Rate Limiting (Already Configured)

The rate limiting middleware is already configured in `AppModule` and applies to all routes with the following limits:

- **Login routes** (`/auth/login`): 5 requests per minute
- **Auth routes** (`/auth/*`): 10 requests per minute  
- **API routes** (`/api/*`): 100 requests per minute
- **Default**: 60 requests per minute

The rate limiting is automatically applied to all routes based on the route path patterns defined in the middleware.

## Response Headers

The rate limiter adds the following headers to responses:

- `X-RateLimit-Limit`: Maximum requests allowed in the window
- `X-RateLimit-Remaining`: Remaining requests in the current window
- `X-RateLimit-Reset`: Time when the rate limit resets (ISO string)
- `Retry-After`: Seconds to wait before retrying (when rate limited)

## Error Response

When rate limited, the API returns:

```json
{
  "message": "Too many requests",
  "statusCode": 429,
  "rateLimitInfo": {
    "limit": 5,
    "remaining": 0,
    "resetTime": "2024-01-01T12:00:00.000Z",
    "isBlocked": true
  }
}
```

## Configuration

The rate limits are configured in the `RateLimitMiddleware.getRouteConfig()` method. You can modify these limits based on your requirements.

## Storage

Currently uses in-memory storage.

## Enhancement

- Usage of Redis for storage
- Cron to remove expired entry from the map.
