import React, { useState, useMemo } from 'react';
import type { JournalEntry, Mood } from '../types/journal';
import EntryCard from '../components/EntryCard';
import { Search } from 'lucide-react';

const MOOD_OPTIONS: Mood[] = ['happy', 'calm', 'reflective', 'excited', 'neutral', 'anxious', 'sad'];

interface Props {
    entries: JournalEntry[];
    onSelect: (entry: JournalEntry) => void;
    onDelete: (id: string) => void;
}

export default function HistoryPage({ entries, onSelect, onDelete }: Props) {
    const [query, setQuery] = useState('');
    const [filterMood, setFilterMood] = useState<Mood | 'all'>('all');

    const filtered = useMemo(() => {
        return entries.filter(e => {
            const matchesMood = filterMood === 'all' || e.mood === filterMood;
            const q = query.toLowerCase();
            const matchesQuery = !q || e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
            return matchesMood && matchesQuery;
        });
    }, [entries, query, filterMood]);

    const grouped = useMemo(() => {
        const groups: Record<string, JournalEntry[]> = {};
        filtered.forEach(e => {
            const key = new Date(e.date).toLocaleDateString('en', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(e);
        });
        return groups;
    }, [filtered]);

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
                <div>
                    <h1 className="text-[18px] font-medium text-gray-900 mb-1">History</h1>
                    <p className="text-[13px] text-gray-400">{entries.length} entries total</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search entries..."
                            className="w-full pl-8 pr-3 py-2 text-[13px] bg-white border border-gray-100 rounded-lg outline-none focus:border-gray-300 transition-colors"
                        />
                    </div>
                    <select
                        value={filterMood}
                        onChange={e => setFilterMood(e.target.value as Mood | 'all')}
                        className="px-3 py-2 text-[13px] bg-white border border-gray-100 rounded-lg outline-none text-gray-600"
                    >
                        <option value="all">All moods</option>
                        {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {Object.entries(grouped).map(([month, monthEntries]) => (
                    <div key={month}>
                        <p className="text-[12px] font-medium text-gray-400 mb-2">{month}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {monthEntries.map(entry => (
                                <EntryCard key={entry.id} entry={entry} onSelect={onSelect} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[14px] text-gray-400">No entries found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
