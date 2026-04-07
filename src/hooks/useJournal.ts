import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry, Mood } from '../types/journal';

const STORAGE_KEY = 'reflct_journal_entries';
const SEED_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        title: 'End of month thoughts',
        content : "March flew by. I made progress on the side project but still haven't found that consistent rhythm. Need to stop waiting for the perfect block of time and just start. Even 20 minutes counts.",
        date: new Date(Date.now() - 86400000).toISOString(),
        mood: 'anxious',
        wordCount: 42,
        moodAnalysis: { 
            mood: 'anxious', 
            confidence: 78, 
            keywords: ['pressure', 'progress', 'rhythm', 'perfectionism'],
            summary: 'Feeling the weight of unmet expectations but showing awareness.',
            prompt: 'What would "good enough" look like for you right now?',
        }
    },
    {
        id: '2',
        title: 'Sunday reset',
        content: "Long walk in the morning helped clear my head. Finished the book I started two months ago. Small wins, but they felt real. The city was quiet. I want more mornings like this.",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        mood: 'happy',
        wordCount: 38,
        moodAnalysis: {
            mood: 'happy',
            confidence: 91,
            keywords: ['peace', 'simplicity', 'clarity', 'gratitude'],
            summary: 'A grounding, restorative day filled with small joys.',
            prompt: 'What made this morning feel different from others?',
        }
    },
    {
        id: '3',
        title: 'Late night thoughts',
        content: "Couldn't sleep. Too many things running through my head. Wrote them all down and somehow that helped. The act of naming things takes away some of their power.",
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
        mood: 'reflective',
        wordCount: 33,
        moodAnalysis: {
            mood: 'reflective',
            confidence: 85,
            keywords: ['insomnia', 'naming', 'release', 'awareness'],
            summary: 'Processing anxiety through writing, finding relief in expression.',
            prompt: 'Which thought, once written down, lost the most power over you?',
        }
    },
];


export function useJournal() {
    const [entries, setEntries] = useState<JournalEntry[]> ([]);

    useEffect(() => {
        try{
            const stored = localStorage.getItem(STORAGE_KEY);
            if(stored){
                setEntries(JSON.parse(stored));
            }
            else{
                setEntries(SEED_ENTRIES);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
            }
        }catch{
            setEntries(SEED_ENTRIES)
        }
    },[]);

    const save = useCallback((updated: JournalEntry[]) => {
        setEntries(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
    },[]);

    const createEntry = useCallback((): JournalEntry =>{
        const entry: JournalEntry = {
            id: Date.now().toString(),
            title : "",
            content : "",
            date: new Date().toISOString(),
            wordCount: 0,
        };
        return entry;
    },[]);


    const saveEntry = useCallback((entry: JournalEntry)=>{
        const wc = entry.content.trim().split(/\s+/).filter(Boolean).length;
        const updated = {...entry, worldCount: wc };

        setEntries (prev=>{
            const exists = prev.find(e => e.id === entry.id);

            const next = exists
                ? prev.map(e => e.id === entry.id ? updated: e)
                : [updated, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            return next;
        });
        return updated;
    },[]);


    const deleteEntry = useCallback((id: string)=> {
        setEntries(prev => {
            const next = prev.filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },[])


    const getStreak = useCallback((): number => {
        if (entries.length === 0) return 0;
        const today = new Date(); today.setHours(0,0,0,0);
        let streak = 0;
        let check = new Date(today);
        for (let i = 0; i < 365; i++) {
            const dateStr = check.toDateString();
            if (entries.some(e => new Date(e.date).toDateString() === dateStr)) {
                streak++;
                check.setDate(check.getDate() - 1);
            } else if (i === 0) {
                check.setDate(check.getDate() - 1);
                const yday = entries.some(e => new Date(e.date).toDateString() === check.toDateString());
                if (!yday) break;
                streak++;
                check.setDate(check.getDate() - 1);
            } else break;
        }
        return streak;
    }, [entries]);


    const getMoodHistory = useCallback((): { day: string; mood?: Mood }[] => {
        const days: { day: string; mood?: Mood }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
            const label = d.toLocaleDateString('en', { weekday: 'short' });
            const entry = entries.find(e => new Date(e.date).toDateString() === d.toDateString());
            days.push({ day: label, mood: entry?.mood });
        }
        return days;
    }, [entries]);


    return { entries, createEntry, saveEntry, deleteEntry, save, getStreak, getMoodHistory };
};
