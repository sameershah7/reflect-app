import React, { useState, useEffect, useRef } from 'react';
import type { Mood } from '../types/journal';
import { MOOD_LIGHT } from './MoodBadge';
import { PenLine, LayoutDashboard, BarChart2, History, Menu, X } from 'lucide-react';

type Page = 'editor' | 'insights' | 'history';

interface Props {
    page: Page;
    onPage: (p: Page) => void;
    onNew: () => void;
    streak: number;
    moodHistory: { day: string; mood?: Mood }[];
}

export default function Sidebar({ page, onPage, onNew, streak, moodHistory }: Props) {
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (open && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    function handleNav(p: Page) {
        onPage(p);
        setOpen(false);
    }

    function handleNew() {
        onNew();
        setOpen(false);
    }

    const sidebarContent = (
        <>
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-[15px] font-medium text-gray-900 tracking-tight">Reflect</span>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <button
                onClick={handleNew}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-violet-50 border border-violet-200 text-[13px] font-medium text-violet-800 hover:bg-violet-100 transition-colors"
            >
                <PenLine size={14} />
                New entry
            </button>

            <nav className="flex flex-col gap-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest px-1 mb-1">Menu</p>
                {([
                    { id: 'editor',   label: 'All entries', Icon: LayoutDashboard },
                    { id: 'insights', label: 'Insights',    Icon: BarChart2 },
                    { id: 'history',  label: 'History',     Icon: History },
                ] as { id: Page; label: string; Icon: React.ElementType }[]).map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleNav(id)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] transition-colors text-left ${
page === id
? 'bg-gray-100 text-gray-900 font-medium'
: 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
}`}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
            </nav>

            <div className="mt-auto">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest px-1 mb-2">Moods this week</p>
                <div className="flex gap-1 px-1">
                    {moodHistory?.map(({ day, mood }) => (
                        <div key={day} className="flex flex-col items-center gap-1 flex-1">
                            <div
                                className="w-full h-6 rounded"
                                style={{ background: mood ? MOOD_LIGHT[mood] : '#F1EFE8' }}
                                title={mood ?? 'no entry'}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-1 mt-1">
                    <span className="text-[10px] text-gray-400">Mon</span>
                    <span className="text-[10px] text-gray-400">Sun</span>
                </div>
                {streak > 0 && (
                    <p className="text-[11px] text-gray-500 mt-3 px-1">
                        🔥 {streak}-day streak
                    </p>
                )}
            </div>
        </>
    );

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white border border-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm transition-colors"
            >
                <Menu size={18} />
            </button>

            {/* ── backdrop — mobile only ── */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/20"
                    onClick={() => setOpen(false)}
                />
            )}

            <div ref={sidebarRef}>
                {/* desktop */}
                <aside className="hidden lg:flex w-[220px] shrink-0 bg-white border-r border-gray-100 flex-col gap-5 p-4 h-full">
                    {sidebarContent}
                </aside>

                {/* mobile drawer */}
                <aside
                    className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[220px] bg-white border-r border-gray-100 flex flex-col gap-5 p-4 transition-transform duration-200 ease-in-out ${
open ? 'translate-x-0' : '-translate-x-full'
}`}
                >
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
}
