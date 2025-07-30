import { Injectable } from '@nestjs/common';

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  isBlocked: boolean;
}

@Injectable()
export class RateLimitService {
  private readonly store = new Map<string, { count: number; resetTime: number }>();

  async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<RateLimitInfo> {
    const now = Date.now();
    const resetTime = new Date(now + windowMs);
    
    const existing = this.store.get(key);
    
    if (!existing || now > existing.resetTime) {
      // First request or window expired
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return {
        limit,
        remaining: limit - 1,
        resetTime,
        isBlocked: false,
      };
    }

    if (existing.count >= limit) {
      // Rate limit exceeded
      return {
        limit,
        remaining: 0,
        resetTime: new Date(existing.resetTime),
        isBlocked: true,
      };
    }

    // Increment count
    existing.count++;
    this.store.set(key, existing);

    return {
      limit,
      remaining: limit - existing.count,
      resetTime: new Date(existing.resetTime),
      isBlocked: false,
    };
  }

  async resetRateLimit(key: string): Promise<void> {
    this.store.delete(key);
  }

} 