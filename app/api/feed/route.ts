import { NextRequest, NextResponse } from 'next/server';

// In a real app, this would be stored in a database
// For now, we'll use a simple in-memory store
let feedEntries: Array<{
  id: string;
  original: string;
  defeated: string;
  timestamp: number;
  mode: string;
}> = [];

export async function GET() {
  try {
    // Return the latest 20 entries, sorted by most recent
    const recentEntries = feedEntries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
    
    return NextResponse.json({ entries: recentEntries });
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
    const newEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      original: original.trim(),
      defeated: defeated.trim(),
      timestamp: Date.now(),
      mode
    };
    
    // Add to feed (keep only last 100 entries to prevent memory issues)
    feedEntries.push(newEntry);
    if (feedEntries.length > 100) {
      feedEntries = feedEntries.slice(-100);
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