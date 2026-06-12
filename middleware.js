import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Create a new ratelimiter, that allows 3 requests per 15 minutes
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
});

export async function middleware(request) {
  // Apply security headers to ALL responses first
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Then apply rate limiting specifically for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip = request.ip ?? '127.0.0.1';
    
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
      
      if (!success) {
        return NextResponse.json({error: 'Rate limited. Too many attempts. Try again in 15 minutes.'}, {status: 429});
      }
      
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

    } catch (err) {
      console.error("Upstash Rate Limit Error:", err);
      // Fallback: allow the request if Redis is down
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
