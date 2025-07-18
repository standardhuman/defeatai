'use client';

import { useState, useEffect } from 'react';

interface FeedEntry {
  id: string;
  original: string;
  defeated: string;
  timestamp: number;
  mode: string;
}

export default function PublicFeed() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/feed');
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
    fetchFeed();
    
    // Refresh feed every 30 seconds
    const interval = setInterval(fetchFeed, 30000);
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
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://monkeybot.wtf')}&quote=${encodeURIComponent(entry.defeated.substring(0, 200))}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Community Feed</h2>
        <div className="text-sm text-gray-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No entries yet. Be the first to share!</p>
          <p className="text-sm mt-2">Your defeated text will appear here for others to see.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
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