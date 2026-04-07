export type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'excited' | 'reflective' | 'neutral';

export interface MoodAnalysis {
    mood: Mood;
    confidence: number;
    keywords: string[];
    summary: string;
    prompt: string;
}

export interface JournalEntry{
    id: string;
    title: string;
    content: string;
    date: string;
    mood?: Mood;
    moodAnalysis?: MoodAnalysis;
    wordCount: number;
}
