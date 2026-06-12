import { NextResponse } from 'next/server';

const adminAttempts = new Map();

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip = request.ip || '127.0.0.1';
    const now = Date.now();
    const attempts = adminAttempts.get(ip) || [];
    const valid = attempts.filter(t => now - t < 900000);
    
    if (valid.length >= 3) {
      return NextResponse.json({error: 'Rate limited. Too many attempts. Try again in 15 minutes.'}, {status: 429});
    }
    
    valid.push(now);
    adminAttempts.set(ip, valid);
  }
  return NextResponse.next();
}
