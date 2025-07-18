'use client';

import { useState, useEffect } from 'react';

interface FeedEntry {
  id: string;
  original: string;
  defeated: string;
  timestamp: number;
  mode: string;
  likes: number;
}

interface LikeRecord {
  timestamp: number;
  count: number;
}

export default function PublicFeed() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'recent' | 'likes'>('recent');
  const [likeLimits, setLikeLimits] = useState<Record<string, LikeRecord>>({});

  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/feed', {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to fetch feed');
      
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err) {
      setError('Failed to load feed');
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load liked posts from localStorage
    const saved = localStorage.getItem('likedPosts');
    if (saved) {
      setLikedPosts(new Set(JSON.parse(saved)));
    }
    
    // Load like limits from localStorage
    const savedLimits = localStorage.getItem('likeLimits');
    if (savedLimits) {
      setLikeLimits(JSON.parse(savedLimits));
    }
    
    // Clean up old like limits (older than 24 hours)
    const now = Date.now();
    const cleanedLimits: Record<string, LikeRecord> = {};
    Object.entries(likeLimits).forEach(([key, record]) => {
      if (now - record.timestamp < 24 * 60 * 60 * 1000) {
        cleanedLimits[key] = record;
      }
    });
    if (Object.keys(cleanedLimits).length !== Object.keys(likeLimits).length) {
      setLikeLimits(cleanedLimits);
      localStorage.setItem('likeLimits', JSON.stringify(cleanedLimits));
    }
    
    fetchFeed();
    
    // Refresh feed every 10 seconds
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'heavy': return 'bg-red-600';
      case 'normal': return 'bg-blue-600';
      case 'light': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const shareToTwitter = (entry: FeedEntry) => {
    const text = `"${entry.defeated.substring(0, 200)}${entry.defeated.length > 200 ? '...' : ''}"`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://monkeybot.wtf')}&hashtags=DefeatAI,AIProof`;
    window.open(url, '_blank');
  };

  const shareToFacebook = (entry: FeedEntry) => {
    // Copy text to clipboard first since Facebook doesn't allow pre-filled text
    const textToShare = `"${entry.defeated.substring(0, 200)}${entry.defeated.length > 200 ? '...' : ''}"`;
    navigator.clipboard.writeText(textToShare);
    
    // Show a quick alert
    alert('Text copied! Paste it into your Facebook post after the link.');
    
    // Open Facebook share dialog with just the URL
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://monkeybot.wtf')}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleLike = async (entryId: string) => {
    const isLiked = likedPosts.has(entryId);
    const action = isLiked ? 'unlike' : 'like';
    
    // Check rate limiting for likes (not unlikes)
    if (action === 'like') {
      const now = Date.now();
      const userLikeKey = 'user_likes';
      const likeRecord = likeLimits[userLikeKey];
      
      // Reset counter if it's been more than an hour
      if (likeRecord && now - likeRecord.timestamp > 60 * 60 * 1000) {
        const newLimits = { ...likeLimits };
        delete newLimits[userLikeKey];
        setLikeLimits(newLimits);
        localStorage.setItem('likeLimits', JSON.stringify(newLimits));
      } else if (likeRecord && likeRecord.count >= 10) {
        // Rate limit: 10 likes per hour
        alert('You\'ve reached the hourly like limit. Please try again later!');
        return;
      }
    }
    
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId,
          action,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        const newLikedPosts = new Set(likedPosts);
        if (isLiked) {
          newLikedPosts.delete(entryId);
        } else {
          newLikedPosts.add(entryId);
          
          // Update like limits
          const now = Date.now();
          const userLikeKey = 'user_likes';
          const currentRecord = likeLimits[userLikeKey] || { timestamp: now, count: 0 };
          
          const newLimits = {
            ...likeLimits,
            [userLikeKey]: {
              timestamp: currentRecord.timestamp,
              count: currentRecord.count + 1
            }
          };
          setLikeLimits(newLimits);
          localStorage.setItem('likeLimits', JSON.stringify(newLimits));
        }
        setLikedPosts(newLikedPosts);
        
        // Save to localStorage
        localStorage.setItem('likedPosts', JSON.stringify(Array.from(newLikedPosts)));
        
        // Update the entry's like count
        setEntries(prevEntries => 
          prevEntries.map(entry => 
            entry.id === entryId 
              ? { ...entry, likes: data.likes }
              : entry
          )
        );
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Community Feed</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-400">Loading feed...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Community Feed</h2>
        <div className="text-red-400 text-center py-8">
          {error}
        </div>
      </div>
    );
  }

  // Sort entries based on filter mode
  const sortedEntries = [...entries].sort((a, b) => {
    if (filterMode === 'likes') {
      // Sort by likes (descending), then by timestamp
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      return b.timestamp - a.timestamp;
    }
    // Default to recent (timestamp descending)
    return b.timestamp - a.timestamp;
  });

  // Show up to 15 entries
  const displayedEntries = sortedEntries.slice(0, 15);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Community Feed</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setFilterMode('recent')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                filterMode === 'recent' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setFilterMode('likes')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                filterMode === 'likes' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Most Liked
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No entries yet. Be the first to share!</p>
          <p className="text-sm mt-2">Your defeated text will appear here for others to see.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {displayedEntries.map((entry) => (
            <div key={entry.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getModeColor(entry.mode)}`}>
                    {entry.mode}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleLike(entry.id)}
                    className={`flex items-center space-x-1 text-sm ${
                      likedPosts.has(entry.id) 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    title={likedPosts.has(entry.id) ? 'Unlike' : 'Like'}
                  >
                    <span>{likedPosts.has(entry.id) ? '❤️' : '🤍'}</span>
                    <span>{entry.likes || 0}</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareToTwitter(entry)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                      title="Share on Twitter"
                    >
                      🐦
                    </button>
                    <button
                      onClick={() => shareToFacebook(entry)}
                      className="text-blue-600 hover:text-blue-500 text-sm"
                      title="Share on Facebook"
                    >
                      📘
                    </button>
                    <button
                      onClick={() => copyToClipboard(entry.defeated)}
                      className="text-gray-400 hover:text-gray-300 text-sm"
                      title="Copy defeated text"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-white bg-gray-800 p-3 rounded">
                {entry.defeated}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}