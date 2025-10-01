import { NextResponse } from 'next/server';
import { rateLimit } from '../../../../lib/rateLimiter';
const db = require('../../../../lib/db');

export async function GET(request) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request);
  
  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too Many Requests', 
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      }), 
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remainingRequests.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      }
    );
  }

  try {
    const rows = await db.query(`
      SELECT l.Province, SUM(f.AgreementValue) as totalAmount
      FROM FactGrants f
      JOIN DimLocation l ON f.LocationID = l.LocationID
      GROUP BY l.Province
      ORDER BY totalAmount DESC
    `);
    
    const response = NextResponse.json(rows);
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remainingRequests.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
    
    return response;
  } catch (err) {
    console.error('Database error:', err);
    return new NextResponse('Server Error: ' + err.message, { status: 500 });
  }
}


