import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitService: RateLimitService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = this.getClientIP(req);
    const routePath = this.getRoutePath(req);
    const key = `rate_limit:${ip}:${routePath}`;
    
    
    const routeConfig = this.getRouteConfig(routePath);
    const rateLimitInfo = await this.rateLimitService.checkRateLimit(
      key,
      routeConfig.limit,
      routeConfig.windowMs,
    );

    // Add headers
    res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime.toISOString());

    if (rateLimitInfo.isBlocked) {
      res.setHeader('Retry-After', Math.ceil(routeConfig.windowMs / 1000));
      throw new HttpException(
        {
          message: 'Too many requests',
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          rateLimitInfo,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }

  private getRoutePath(req: Request): string {
    // Try to get the route path from different sources
    const originalUrl = req.originalUrl || req.url;
    const path = req.path;
    
    // If we have a full URL, extract the path
    if (originalUrl && originalUrl !== '/') {
      try {
        const url = new URL(originalUrl, `http://${req.headers.host}`);
        return url.pathname;
      } catch {
        // If URL parsing fails, use the original URL
        return originalUrl;
      }
    }
    
    // Fallback to req.path
    return path || '/';
  }

  private getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'] as string;
    const remoteAddress = req.socket?.remoteAddress;

    let ip = forwarded?.split(',')[0]?.trim() || realIp || remoteAddress || 'unknown';
    
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
    
    return ip;
  }

  private getRouteConfig(path: string): { limit: number; windowMs: number } {
    // Different rate limits for different routes
    if (path.includes('/auth/login')) {
      return { limit: 5, windowMs: 60000 }; // 5 login attempts per minute
    }
    
    if (path.includes('/auth/')) {
      return { limit: 10, windowMs: 60000 }; // 10 auth requests per minute
    }
    
    if (path.includes('/api/')) {
      return { limit: 100, windowMs: 60000 }; // 100 API requests per minute
    }
    
    return { limit: 60, windowMs: 60000 }; // Default: 60 requests per minute
  }
} 