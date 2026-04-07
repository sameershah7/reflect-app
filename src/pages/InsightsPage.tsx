import React, { useMemo } from 'react';
import type { JournalEntry, Mood } from '../types/journal';
import MoodBadge from '../components/MoodBadge';
import { MOOD_LIGHT, MOOD_DOT } from '../components/MoodBadge';

interface Props {
    entries: JournalEntry[];
}

const ALL_MOODS: Mood[] = ['happy', 'calm', 'reflective', 'excited', 'neutral', 'anxious', 'sad'];

export default function InsightsPage({ entries: allEntries }: Props) {
    const entries = allEntries.filter(e => e.mood);

    const moodCounts = useMemo(() => {
        const counts: Partial<Record<Mood, number>> = {};
        entries.forEach(e => { if (e.mood) counts[e.mood] = (counts[e.mood] ?? 0) + 1; });
        return counts;
    }, [entries]);

    const topMood = useMemo(() => {
        let top: Mood | null = null;
        let max = 0;
        (Object.entries(moodCounts) as [Mood, number][]).forEach(([mood, count]) => {
            if (count > max) { max = count; top = mood; }
        });
        return top;
    }, [moodCounts]);

    const totalWords = allEntries.reduce((a, e) => a + e.wordCount, 0);

    const last30 = useMemo(() => {
        const days: { date: string; mood?: Mood }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
            const entry = allEntries.find(e => new Date(e.date).toDateString() === d.toDateString());
            days.push({ date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), mood: entry?.mood });
        }
        return days;
    }, [allEntries]);

    const maxCount = Math.max(...Object.values(moodCounts).map(Number), 1);

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                <div>
                    <h1 className="text-[18px] font-medium text-gray-900 mb-1">Insights</h1>
                    <p className="text-[13px] text-gray-400">Your emotional patterns over time</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total entries', value: allEntries.length },
                        { label: 'Words written', value: totalWords.toLocaleString() },
                        { label: 'Moods tracked', value: entries.length },
                    ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[11px] text-gray-400 mb-1">{label}</p>
                                <p className="text-[22px] font-medium text-gray-900">{value}</p>
                            </div>
                        ))}
                </div>

                {topMood && (
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">Most common mood</p>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: MOOD_LIGHT[topMood] }}
                            >
                                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: MOOD_DOT[topMood] }} />
                            </div>
                            <div>
                                <p className="text-[16px] font-medium capitalize" style={{ color: MOOD_DOT[topMood] }}>{topMood}</p>
                                <p className="text-[12px] text-gray-400">{moodCounts[topMood]} entries</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-4">Mood breakdown</p>
                    {ALL_MOODS.map(mood => {
                        const count = moodCounts[mood] ?? 0;
                        const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                        return (
                            <div key={mood} className="flex items-center gap-3 mb-3 last:mb-0">
                                <MoodBadge mood={mood} size="sm" />
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%`, background: MOOD_DOT[mood] }}
                                    />
                                </div>
                                <span className="text-[12px] text-gray-400 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-4">Last 30 days</p>
                    <div className="flex gap-1 flex-wrap">
                        {last30.map(({ date, mood }, i) => (
                            <div
                                key={i}
                                className="w-6 h-6 rounded"
                                style={{
                                    background: mood ? MOOD_LIGHT[mood] : '#F1EFE8',
                                    border: mood ? 'none' : '1px solid #E5E7EB'
                                }}
                                title={`${date}: ${mood ?? 'no entry'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-3 mt-3 flex-wrap">
                        {ALL_MOODS.filter(m => moodCounts[m]).map(mood => (
                            <span key={mood} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: MOOD_LIGHT[mood] }} />
                                {mood}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
