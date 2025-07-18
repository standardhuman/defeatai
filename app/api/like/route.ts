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

export async function POST(request: NextRequest) {
  try {
    const { entryId, action } = await request.json();
    
    // Validate input
    if (!entryId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Get user's liked posts from localStorage (tracked client-side)
    // In a real app, this would be user-specific in the database
    
    let entries: FeedEntry[] = [];
    
    if (redis) {
      try {
        const storedEntries = await redis.get<FeedEntry[]>('feed_entries');
        if (storedEntries) {
          entries = storedEntries;
        }
        
        // Find the entry and update likes
        const entryIndex = entries.findIndex(e => e.id === entryId);
        if (entryIndex !== -1) {
          if (action === 'like') {
            entries[entryIndex].likes = (entries[entryIndex].likes || 0) + 1;
          } else {
            entries[entryIndex].likes = Math.max(0, (entries[entryIndex].likes || 0) - 1);
          }
          
          // Save back to Redis
          await redis.set('feed_entries', entries);
          
          return NextResponse.json({ 
            success: true, 
            likes: entries[entryIndex].likes 
          });
        } else {
          return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }
      } catch (redisError) {
        console.log('Redis error:', redisError);
        return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
      }
    } else {
      // In-memory fallback (for development)
      return NextResponse.json({ 
        success: true, 
        likes: action === 'like' ? 1 : 0 
      });
    }
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}