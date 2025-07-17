import { NextRequest, NextResponse } from 'next/server';
import { AIDefeater, DefeaterMode } from '@/lib/aiDefeater';

export async function POST(request: NextRequest) {
  try {
    const { text, mode = 'normal', customPhrases = [] } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const validModes: DefeaterMode[] = ['light', 'normal', 'heavy'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Use: light, normal, or heavy' },
        { status: 400 }
      );
    }

    if (!Array.isArray(customPhrases)) {
      return NextResponse.json(
        { error: 'Custom phrases must be an array' },
        { status: 400 }
      );
    }

    const defeater = new AIDefeater(customPhrases);
    const defeatedText = defeater.defeatAI(text, mode);
    const stats = defeater.getStats(text, defeatedText);

    return NextResponse.json({
      original: text,
      defeated: defeatedText,
      stats
    });
  } catch (error) {
    console.error('Error in defeat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}