import React from "react";
import type {JournalEntry } from "../types/journal";
import MoodBadge from "./MoodBadge";
import { Trash2 } from "lucide-react"


interface Props {
    entry: JournalEntry;
    onSelect: (entry: JournalEntry ) => void;
    onDelete: (id: string ) => void;
}

export default function EntryCard({entry, onSelect, onDelete}: Props){
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    const preview = entry.content.slice(0, 100).trim();

    return (
        <div
            className="group bg-white border border-gray-100 rounded-xl p-3.5 cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all"
            onClick={() => onSelect(entry)}
        >
            <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[11px] text-gray-400">{dateStr}</p>
                <button
                    onClick={e => { e.stopPropagation(); onDelete(entry.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                >
                    <Trash2 size={13} />
                </button>
            </div>
            <p className="text-[13px] font-medium text-gray-900 mb-1.5 leading-snug line-clamp-1">
                {entry.title || 'Untitled'}
            </p>
            {preview && (
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                    {preview}
                </p>
            )}
            <div className="flex items-center justify-between">
                {entry.mood ? <MoodBadge mood={entry.mood} size="sm" /> : <span />}
                <span className="text-[10px] text-gray-300">{entry.wordCount}w</span>
            </div>
        </div>
    );
}
