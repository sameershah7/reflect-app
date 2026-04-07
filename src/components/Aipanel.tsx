import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { MoodAnalysis } from '../types/journal';
import { MOOD_LIGHT, MOOD_DOT } from './MoodBadge';

interface Props {
    analysis?: MoodAnalysis;
    analyzing: boolean;
    wordCount: number;
    onAnalyze: () => void;
    streak: number;
    moodHistory: { day: string; mood?: import('../types/journal').Mood }[];
}

export default function AIPanel({
    analysis,
    analyzing,
    wordCount,
    onAnalyze,
    streak,
    moodHistory
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-40 bg-violet-500 text-white p-3 rounded-full shadow-lg"
            >
                <Sparkles size={18} />
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                />
            )}

            {/* Panel */}
            <aside
                className={`
fixed top-0 right-0 h-full z-50
w-[85%] max-w-[320px]
bg-white border-l border-gray-100
flex flex-col gap-5 p-4
transform transition-transform duration-300

${open ? 'translate-x-0' : 'translate-x-full'}

lg:static lg:translate-x-0 lg:w-[272px]
`}
            >
                {/* Close button (mobile only) */}
                <button
                    onClick={() => setOpen(false)}
                    className="lg:hidden self-end text-gray-400 text-sm"
                >
                    Close
                </button>

                {/* AI Mood Analysis */}
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                        AI mood analysis
                    </p>

                    {analysis ? (
                        <div
                            className="rounded-xl p-3"
                            style={{ background: MOOD_LIGHT[analysis.mood] + '55' }}
                        >
                            <div className="flex items-center gap-2.5 mb-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: MOOD_LIGHT[analysis.mood] }}
                                >
                                    <div
                                        className="w-3.5 h-3.5 rounded-full border-2"
                                        style={{ borderColor: MOOD_DOT[analysis.mood] }}
                                    />
                                </div>

                                <div>
                                    <p
                                        className="text-[14px] font-medium capitalize"
                                        style={{ color: MOOD_DOT[analysis.mood] }}
                                    >
                                        {analysis.mood}
                                    </p>
                                    <p
                                        className="text-[11px]"
                                        style={{ color: MOOD_DOT[analysis.mood] + 'bb' }}
                                    >
                                        Confidence {analysis.confidence}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {analysis.keywords.map(kw => (
                                    <span
                                        key={kw}
                                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                                        style={{
                                            background: MOOD_LIGHT[analysis.mood],
                                            color: MOOD_DOT[analysis.mood]
                                        }}
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>

                            <p className="text-[12px] text-gray-600 leading-relaxed">
                                {analysis.summary}
                            </p>
                        </div>
                    ) : (
                            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                                <Sparkles size={20} className="text-violet-300 mx-auto mb-2" />
                                <p className="text-[12px] text-gray-400">
                                    {wordCount < 20
                                        ? 'Write at least 20 words to enable analysis'
                                        : 'Click analyze to detect your mood'}
                                </p>
                            </div>
                        )}
                </div>

                {/* AI Prompt */}
                {analysis?.prompt && (
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                            AI writing prompt
                        </p>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[12px] text-gray-600 leading-relaxed italic">
                                "{analysis.prompt}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Streak */}
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                        {streak > 0 ? `${streak}-day streak` : 'Streak'}
                    </p>

                    <div className="flex gap-1.5">
                        {moodHistory.map(({ day, mood }, i) => (
                            <div
                                key={i}
                                className="w-7 h-7 rounded"
                                style={{
                                    background: mood ? MOOD_LIGHT[mood] : '#F1EFE8',
                                    border: mood ? 'none' : '1px solid #D3D1C7'
                                }}
                                title={`${day}: ${mood ?? 'no entry'}`}
                            />
                        ))}
                    </div>

                    <p className="text-[11px] text-gray-400 mt-1.5">
                        {streak > 0 ? 'Keep it up!' : 'Start your streak today'}
                    </p>
                </div>

                {/* Button */}
                <div className="mt-auto">
                    <button
                        onClick={onAnalyze}
                        disabled={analyzing || wordCount < 20}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500 text-white text-[13px] font-medium hover:bg-violet-600 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                                <>
                                    <Sparkles size={14} />
                                    Analyze mood
                                </>
                            )}
                    </button>
                </div>
            </aside>
        </>
    );
}
