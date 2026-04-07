import type { MoodAnalysis, Mood } from '../types/journal';

export const MOOD_COLORS: Record<Mood, string> = {
    happy:      'bg-green-100 text-green-800',
    calm:       'bg-teal-100 text-teal-800',
    anxious:    'bg-amber-100 text-amber-800',
    sad:        'bg-blue-100 text-blue-800',
    excited:    'bg-pink-100 text-pink-800',
    reflective: 'bg-purple-100 text-purple-800',
    neutral:    'bg-gray-100 text-gray-700',
};

export const MOOD_BG: Record<Mood, string> = {
    happy:      '#C0DD97',
    calm:       '#9FE1CB',
    anxious:    '#FAC775',
    sad:        '#85B7EB',
    excited:    '#ED93B1',
    reflective: '#CECBF6',
    neutral:    '#D3D1C7',
};


const MOOD_KEYWORDS: Record<Mood, string[]> = {
    happy: [
        'happy', 'happiness', 'joy', 'joyful', 'great', 'wonderful', 'fantastic',
        'love', 'loved', 'amazing', 'grateful', 'gratitude', 'smile', 'laugh',
        'excited', 'good', 'best', 'proud', 'thankful', 'blessed', 'delight',
        'cheerful', 'content', 'pleased', 'glad', 'enjoy', 'enjoyed', 'fun',
    ],
    calm: [
        'calm', 'peace', 'peaceful', 'quiet', 'relax', 'relaxed', 'relaxing',
        'still', 'gentle', 'serene', 'rest', 'rested', 'breath', 'breathe',
        'slow', 'steady', 'settled', 'comfortable', 'safe', 'grounded', 'clear',
        'balanced', 'tranquil', 'easy', 'soft', 'simple', 'mindful',
    ],
    anxious: [
        'anxious', 'anxiety', 'worry', 'worried', 'worrying', 'stress', 'stressed',
        'nervous', 'overwhelm', 'overwhelmed', 'fear', 'scared', 'panic', 'tense',
        'tension', 'pressure', 'dread', 'dreading', 'uneasy', 'unsettled', 'rush',
        'deadline', 'behind', 'failing', 'mess', 'lost', 'stuck', 'confused',
    ],
    sad: [
        'sad', 'sadness', 'cry', 'crying', 'cried', 'lonely', 'alone', 'miss',
        'missing', 'loss', 'hurt', 'pain', 'grief', 'empty', 'tired', 'hopeless',
        'down', 'low', 'heavy', 'hard', 'difficult', 'struggle', 'struggling',
        'broken', 'numb', 'disappointed', 'disappointment', 'regret',
    ],
    excited: [
        'excited', 'excitement', 'thrill', 'thrilled', 'pumped', 'energy',
        'energized', 'buzz', 'fired up', 'wow', 'incredible', 'unbelievable',
        'can\'t wait', 'looking forward', 'opportunity', 'new', 'start', 'begin',
        'adventure', 'finally', 'achieved', 'accomplished', 'won', 'success',
    ],
    reflective: [
        'think', 'thinking', 'thought', 'wonder', 'wondering', 'reflect',
        'reflection', 'maybe', 'realize', 'realized', 'remember', 'remembered',
        'question', 'meaning', 'consider', 'understand', 'lesson', 'learned',
        'pattern', 'notice', 'noticed', 'aware', 'awareness', 'perspective',
        'looking back', 'in hindsight', 'i wonder', 'i realize', 'makes me think',
    ],
    neutral: [
        'okay', 'fine', 'normal', 'usual', 'average', 'alright', 'ok',
        'nothing special', 'same as', 'routine', 'regular', 'typical', 'so-so',
    ],
};

const MOOD_SUMMARIES: Record<Mood, string[]> = {
    happy: [
        'Your entry radiates warmth and positivity.',
        'A genuinely uplifting tone runs through your writing.',
        'There\'s real joy and gratitude in what you\'ve shared.',
    ],
    calm: [
        'A sense of peace and stillness comes through your words.',
        'Your entry has a grounded, settled quality to it.',
        'There\'s a quiet clarity in how you\'ve expressed yourself.',
    ],
    anxious: [
        'Threads of worry and tension are woven through your writing.',
        'Your entry carries the weight of unresolved stress.',
        'There\'s a restless, pressured energy in what you\'ve written.',
    ],
    sad: [
        'Your entry carries a heavier, more melancholic tone.',
        'There\'s a sense of longing or loss beneath your words.',
        'A tender vulnerability comes through in your writing.',
    ],
    excited: [
        'High energy and enthusiasm come through clearly.',
        'Your entry crackles with anticipation and drive.',
        'There\'s a bright, forward-moving momentum in your words.',
    ],
    reflective: [
        'A thoughtful, introspective mood runs through your entry.',
        'You\'re turning things over carefully — processing something real.',
        'Deep thinking and self-awareness shine through your writing.',
    ],
    neutral: [
        'A balanced, even-keeled tone runs throughout.',
        'Your entry is measured and steady in its emotional register.',
        'A calm, observational quality comes through your words.',
    ],
};

const WRITING_PROMPTS: Record<Mood, string[]> = {
    happy: [
        'What made today feel different from other good days?',
        'Who would you want to share this feeling with, and why?',
        'What small thing contributed most to this happiness?',
    ],
    calm: [
        'What helped you arrive at this sense of peace?',
        'How can you protect this feeling when things get busy?',
        'What does this stillness tell you about what you actually need?',
    ],
    anxious: [
        'What\'s the worst realistic outcome — and could you handle it?',
        'Which of these worries is yours to carry, and which isn\'t?',
        'What would you tell a friend who was feeling exactly this way?',
    ],
    sad: [
        'What do you need most right now that you haven\'t asked for?',
        'Is there something here worth grieving properly?',
        'What\'s one small thing that could make tomorrow feel slightly lighter?',
    ],
    excited: [
        'What\'s the first concrete step you can take to keep this momentum?',
        'What fear might be hiding just behind this excitement?',
        'How will you remember this feeling when doubt creeps in later?',
    ],
    reflective: [
        'What\'s the one insight you most want to hold onto from this?',
        'Has this pattern shown up before in your life?',
        'What action, if any, does this reflection ask of you?',
    ],
    neutral: [
        'Is "okay" actually okay — or is there something you\'re glossing over?',
        'What would make tomorrow feel a little more meaningful?',
        'What are you not saying that might be worth saying?',
    ],
};

// helpers

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function extractMatchedWords(text: string, mood: Mood): string[] {
    const lower = text.toLowerCase();
    return MOOD_KEYWORDS[mood]
        .filter(w => lower.includes(w))
        .slice(0, 5);
}

// main exports

export async function analyzeMood(text: string): Promise<MoodAnalysis> {
    const lower = text.toLowerCase();

    // score each mood by keyword hits
    const scores = (Object.keys(MOOD_KEYWORDS) as Mood[]).map(mood => {
        const hits = MOOD_KEYWORDS[mood].filter(w => lower.includes(w)).length;
        return { mood, hits };
    });

    scores.sort((a, b) => b.hits - a.hits);

    const detectedMood: Mood = scores[0].hits > 0 ? scores[0].mood : 'neutral';
    const totalHits = scores.reduce((sum, s) => sum + s.hits, 0) || 1;

    // confidence: how dominant the top mood is, scaled to 55–95 range
    const rawRatio = scores[0].hits / totalHits;
    const confidence = Math.round(55 + rawRatio * 40);

    const keywords = extractMatchedWords(text, detectedMood);
    const finalKeywords = keywords.length >= 2
        ? keywords
        : [detectedMood, ...scores.slice(1, 4).filter(s => s.hits > 0).map(s => s.mood)];

    return {
        mood: detectedMood,
        confidence,
        keywords: finalKeywords,
        summary: pick(MOOD_SUMMARIES[detectedMood]),
        prompt: pick(WRITING_PROMPTS[detectedMood]),
    };
}

export async function generatePrompt(): Promise<string> {
    const all = Object.values(WRITING_PROMPTS).flat();
    return pick(all);
}
