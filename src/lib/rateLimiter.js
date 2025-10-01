// Simple in-memory rate limiter
// In production, consider using Redis for distributed rate limiting

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 1000) {
    this.maxRequests = maxRequests; // 10 requests
    this.windowMs = windowMs; // per 1000ms (1 second)
    this.requests = new Map(); // Store IP -> { count, resetTime }
    
    // Clean up old entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, data] of this.requests.entries()) {
      if (data.resetTime < now) {
        this.requests.delete(ip);
      }
    }
  }

  isAllowed(ip) {
    const now = Date.now();
    const requestData = this.requests.get(ip);

    if (!requestData) {
      // First request from this IP
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (requestData.resetTime < now) {
      // Window has expired, reset
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (requestData.count >= this.maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment count
    requestData.count++;
    return true;
  }

  getRemainingRequests(ip) {
    const requestData = this.requests.get(ip);
    if (!requestData || requestData.resetTime < Date.now()) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - requestData.count);
  }

  getResetTime(ip) {
    const requestData = this.requests.get(ip);
    if (!requestData || requestData.resetTime < Date.now()) {
      return Date.now() + this.windowMs;
    }
    return requestData.resetTime;
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter(10, 1000); // 10 requests per second

export function rateLimit(req) {
  // Get client IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             req.headers.get('x-real-ip') || 
             '127.0.0.1'; // fallback for localhost

  const isAllowed = rateLimiter.isAllowed(ip);
  
  if (!isAllowed) {
    const remainingRequests = rateLimiter.getRemainingRequests(ip);
    const resetTime = rateLimiter.getResetTime(ip);
    
    return {
      allowed: false,
      remainingRequests,
      resetTime,
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
    };
  }

  return {
    allowed: true,
    remainingRequests: rateLimiter.getRemainingRequests(ip),
    resetTime: rateLimiter.getResetTime(ip)
  };
}

export default rateLimiter;
