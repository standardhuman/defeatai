import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  const status = {
    configured: false,
    connected: false,
    error: null as string | null,
    envVarsPresent: {
      url: !!process.env.UPSTASH_REDIS_REST_URL,
      token: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    }
  };

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      status.configured = true;
      
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      
      // Try a simple operation
      await redis.ping();
      status.connected = true;
      
      // Get feed entry count
      const entries = await redis.get<any[]>('feed_entries');
      const entryCount = entries ? entries.length : 0;
      
      return NextResponse.json({
        ...status,
        message: 'Redis is working correctly!',
        feedEntries: entryCount
      });
    } else {
      return NextResponse.json({
        ...status,
        message: 'Redis environment variables not found'
      });
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      ...status,
      message: 'Redis connection failed'
    });
  }
}