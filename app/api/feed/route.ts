import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

interface FeedEntry {
  id: string;
  original: string;
  defeated: string;
  timestamp: number;
  mode: string;
  likes: number;
}

// Initialize Redis client
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.log('Redis initialization failed:', error);
}

export async function GET() {
  try {
    // Try to get entries from KV store
    // If KV is not configured, fall back to empty array
    let entries: FeedEntry[] = [];
    
    if (redis) {
      try {
        const storedEntries = await redis.get<FeedEntry[]>('feed_entries');
        if (storedEntries) {
          entries = storedEntries;
        }
      } catch (redisError) {
        console.log('Redis error:', redisError);
      }
    } else {
      console.log('Redis not configured, returning empty feed');
    }
    
    // Return the latest 50 entries, sorted by most recent
    const recentEntries = entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
    
    return NextResponse.json(
      { entries: recentEntries },
      { 
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { original, defeated, mode } = await request.json();
    
    // Basic validation
    if (!original || !defeated || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Simple content filtering (basic profanity check)
    const inappropriateWords = ['fuck', 'shit', 'damn', 'hell', 'bastard', 'bitch'];
    const textToCheck = (original + ' ' + defeated).toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => 
      textToCheck.includes(word)
    );
    
    if (hasInappropriateContent) {
      return NextResponse.json({ error: 'Content contains inappropriate language' }, { status: 400 });
    }
    
    // Limit text length to prevent spam
    if (original.length > 500 || defeated.length > 1000) {
      return NextResponse.json({ error: 'Text too long' }, { status: 400 });
    }
    
    // Create new entry
    const newEntry: FeedEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      original: original.trim(),
      defeated: defeated.trim(),
      timestamp: Date.now(),
      mode,
      likes: 0
    };
    
    if (redis) {
      try {
        // Get existing entries from Redis
        let entries: FeedEntry[] = [];
        const storedEntries = await redis.get<FeedEntry[]>('feed_entries');
        if (storedEntries) {
          entries = storedEntries;
        }
        
        // Add new entry and keep only last 100
        entries.push(newEntry);
        if (entries.length > 100) {
          entries = entries.slice(-100);
        }
        
        // Save back to Redis
        await redis.set('feed_entries', entries);
      } catch (redisError) {
        console.log('Redis error:', redisError);
      }
    } else {
      console.log('Redis not configured, feed entry not persisted');
    }
    
    return NextResponse.json({ 
      success: true, 
      entry: newEntry 
    });
  } catch (error) {
    console.error('Error adding to feed:', error);
    return NextResponse.json({ error: 'Failed to add to feed' }, { status: 500 });
  }
}