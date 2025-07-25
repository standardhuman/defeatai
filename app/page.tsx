'use client';

import { useState, useEffect } from 'react';
import { AIDefeater, DefeaterMode } from '@/lib/aiDefeater';
import PublicFeed from '@/components/PublicFeed';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<DefeaterMode>('normal');
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState('');
  const [stats, setStats] = useState<{
    originalLength: number;
    defeatedLength: number;
    nonsenseInserted: number;
    percentageIncrease: number;
  } | null>(null);
  const [keepPrivate, setKeepPrivate] = useState(false);

  // Load custom phrases from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customPhrases');
    if (saved) {
      setCustomPhrases(JSON.parse(saved));
    }
  }, []);

  // Save custom phrases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customPhrases', JSON.stringify(customPhrases));
  }, [customPhrases]);

  const handleDefeat = async () => {
    if (!inputText.trim()) return;
    
    // Bot protection: if honeypot is filled, silently reject
    if (honeypot) {
      console.log('Bot detected');
      return;
    }
    
    const defeater = new AIDefeater(customPhrases);
    const defeated = defeater.defeatAI(inputText, mode);
    setOutputText(defeated);
    setStats(defeater.getStats(inputText, defeated));
    
    // Automatically share to feed unless user wants privacy
    if (!keepPrivate) {
      try {
        await fetch('/api/feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            original: inputText,
            defeated: defeated,
            mode,
          }),
        });
      } catch (error) {
        console.error('Error sharing to feed:', error);
        // Don't show error to user - just fail silently
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
  };



  const shareToTwitter = () => {
    const text = `"${outputText.substring(0, 200)}${outputText.length > 200 ? '...' : ''}"`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://monkeybot.wtf')}&hashtags=DefeatAI,AIProof`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    // Copy text to clipboard first since Facebook doesn't allow pre-filled text
    const textToShare = `"${outputText.substring(0, 200)}${outputText.length > 200 ? '...' : ''}"`;
    navigator.clipboard.writeText(textToShare);
    
    // Show a quick alert
    alert('Text copied! Paste it into your Facebook post after the link.');
    
    // Open Facebook share dialog with just the URL
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://monkeybot.wtf')}`;
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        <header className="text-center mb-10">
          <div className="inline-block relative">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Defeater
            </h1>
            <span className="absolute -top-2 -right-16 bg-gradient-to-r from-green-400 to-blue-500 text-xs px-2 py-1 rounded-full text-white font-semibold">
              Powered by AI™
            </span>
          </div>
          <p className="text-gray-300 text-lg">
            Using cutting-edge AI technology to make AI completely useless
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Because the best way to fight fire is with marshmallow jackhammer deluxe edition fire
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="mode" className="block text-sm font-medium mb-2">
              Defeat Mode
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as DefeaterMode)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light - Insert nonsense in ~25% of sentences</option>
              <option value="normal">Normal - Insert nonsense in ~50% of sentences</option>
              <option value="heavy">Heavy - Insert nonsense in EVERY sentence</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="input" className="block text-sm font-medium mb-2">
              Your Original Text
            </label>
            <textarea
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-40 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {/* Honeypot field - hidden from users but visible to bots */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </div>

          <div className="mb-6">
            <div className="flex gap-3 mb-3">
              <button
                onClick={handleDefeat}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition-colors duration-200 relative group"
              >
                Defeat AI
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Algorithm confidence: 99.97%
                </span>
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors duration-200"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                id="keepPrivate"
                checked={keepPrivate}
                onChange={(e) => setKeepPrivate(e.target.checked)}
                className="rounded text-blue-600 mr-2"
              />
              <label htmlFor="keepPrivate" className="text-sm text-gray-400">
                Keep my results private
              </label>
            </div>
          </div>

          {outputText && (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">
                    AI-Defeated Text
                  </label>
                  <button
                    onClick={handleCopy}
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors duration-200"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="w-full bg-gray-700 border border-gray-600 rounded-md p-4 whitespace-pre-wrap">
                  {outputText}
                </div>
              </div>

              {stats && (
                <div className="bg-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Performance Metrics</h3>
                    <span className="text-xs text-gray-400">Certified by AI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Original length:</span>
                      <span className="ml-2">{stats.originalLength} characters</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Enhanced length:</span>
                      <span className="ml-2">{stats.defeatedLength} characters</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Nonsense density:</span>
                      <span className="ml-2">{stats.nonsenseInserted} insertions</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Confusion factor:</span>
                      <span className="ml-2">+{stats.percentageIncrease}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    AI readability score: {Math.max(5, 100 - stats.percentageIncrease * 2)}/100
                  </p>
                </div>
              )}

              {/* Sharing Section */}
              <div className="bg-gray-700 rounded-md p-4 mt-4">
                <h3 className="font-semibold mb-3">Share on Social Media</h3>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={shareToTwitter}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>🐦</span>
                    <span>Twitter</span>
                  </button>
                  
                  <button
                    onClick={shareToFacebook}
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </button>
                </div>
                
                {!keepPrivate && (
                  <p className="text-xs text-gray-400 mt-3">
                    ✓ Your result has been added to the community feed
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Community Feed */}
        <div className="mb-8">
          <PublicFeed />
        </div>

        <footer className="text-center text-gray-400 text-sm space-y-4">
          <div className="border-t border-gray-700 pt-6">
            <p className="text-xs text-gray-500 mb-3">
              This app uses a proprietary AI-powered algorithm™ to generate premium organic nonsense
            </p>
            <p className="mb-2">
              Example: "AI will never be able to write like me. Rubber duck apocalypse now. 
              Because I am now inserting random sentences into every post."
            </p>
            <p className="text-gray-500">
              We can tuna fish tango foxtrot defeat AI.
            </p>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <p>✓ 100% AI-generated anti-AI technology</p>
            <p>✓ Blockchain-free since 2024</p>
            <p>✓ Carbon neutral (our servers run on irony)</p>
            <p className="pt-2 italic">
              "Fighting AI with AI is like bringing a knife to a knife fight, 
              except both knives are made of velcro mushroom cloud nine" — Sun Tzu, The Art of War
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
