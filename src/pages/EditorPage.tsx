import React,{useState, useEffect, useCallback } from "react";
import {Save, ChevronLeft} from "lucide-react";
import  MoodBadge  from "../components/MoodBadge";
import type { JournalEntry } from "../types/journal";
import EntryCard from "../components/EntryCard"
import AIPanel from "../components/Aipanel"
import { analyzeMood } from '../lib/anthropic';

interface Props {
    entries: JournalEntry[];
    activeEntry: JournalEntry | null;
    onSave: (entry: JournalEntry) => JournalEntry;
    onDelete: (id: string) => void;
    onSelect: (entry: JournalEntry | null) => void;
    streak: number;
    moodHistory: { day: string; mood?: import('../types/journal').Mood }[];
}

export default function EditorPage({ entries, activeEntry, onSave, onDelete, onSelect, streak, moodHistory }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saved, setSaved ] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [localEntry, setLocalEntry] = useState<JournalEntry | null>(null);

    useEffect(() => {
        if (activeEntry) {
            setTitle(activeEntry.title);
            setContent(activeEntry.content);
            setLocalEntry(activeEntry);
        }
    }, [activeEntry?.id]);

    const handleSave = useCallback(() => {
        if(!localEntry) return;
        const updated = onSave({...localEntry, title, content});
        setLocalEntry(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    },[localEntry, title, content, onSave]);


    const handleAnalyze = async () => {
        if (!localEntry || wordCount < 20) return;
        setAnalyzing(true);
        try {
            const analysis = await analyzeMood(content);
            const updated = onSave({ ...localEntry, title, content, mood: analysis.mood, moodAnalysis: analysis });
            setLocalEntry(updated);
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };


    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const today = new Date().toLocaleDateString('en', { weekday: 'long' , month: 'long', day: 'numeric', year: 'numeric' });


    return(
        <div className="flex flex-1 min-h-0 overflow-hidden">

            <div className="flex flex-col flex-1 min-w-0">
                <div className="sm:px-14 bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between shrink-0">
                    <div>
                        <p className="text-[15px] font-medium text-gray-900">
                            {activeEntry ? 'Editing entry' : 'All entries'}
                        </p>
                        <p className="text-[12px] text-gray-400">{today}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeEntry?.mood && <MoodBadge mood={activeEntry.mood} size="sm" />}
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-medium text-violet-700">
                            A
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {activeEntry? (
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <button
                                onClick={() => onSelect(null)}
                                className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600 transition-colors w-fit">
                                <ChevronLeft size={14} /> Back to all entries
                            </button>

                            <div className="flex items-center gap-2">
                                <p className="text-[12px] text-gray-400">
                                    {new Date(activeEntry.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                {localEntry?.mood && <MoodBadge mood={localEntry.mood} size="sm" />} 
                            </div>

                            <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Entry title..."
                                    className="text-[16px] font-medium text-gray-900 placeholder-gray-300 outline-none border-none bg-transparent w-full"
                                />
                                <div className="h-px bg-gray-100" />
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="What's on your mind today? Write freely — this space is just for you..."
                                    className="text-[13px] text-gray-600 placeholder-gray-300 outline-none border-none bg-transparent resize-none leading-relaxed min-h-[220px] w-full"
                                    rows={10}
                                />
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-[11px] text-gray-300">{wordCount} words</span>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[12px] font-medium hover:bg-gray-700 active:scale-[0.98] transition-all"
                                    >
                                        <Save size={12} />
                                        {saved ? 'Saved!' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    ):(
                            <div className="flex flex-col gap-4">
                                <p className="text-[12px] text-gray-400">{entries.length} entries</p>
                                <p className="text-[12px] text-gray-400">123 entries</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {entries.map(entry => (
                                        <EntryCard
                                            key={entry.id}
                                            entry={entry}
                                            onSelect={onSelect}
                                            onDelete={onDelete}
                                        />
                                    ))}
                                </div>
                                {entries.length === 0 && (
                                    <div className="text-center py-16">
                                        <p className="text-[14px] text-gray-400">No entries yet. Start writing!</p>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>

            <AIPanel
                analysis={localEntry?.moodAnalysis}
                analyzing={analyzing}
                wordCount={wordCount}
                onAnalyze={handleAnalyze}
                streak={streak}
                moodHistory={moodHistory}
            />


        </div>
    );
}
