import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EditorPage from './pages/EditorPage';
import InsightsPage from './pages/InsightsPage';
import HistoryPage from './pages/HistoryPage';

import { useJournal } from './hooks/useJournal';
import type { JournalEntry } from './types/journal';

type Page = 'editor' | 'insights' | 'history';

export default function App() {
    const { entries, createEntry, saveEntry, deleteEntry, getStreak, getMoodHistory } = useJournal();
    const [page, setPage] = useState<Page>('editor');
    const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

    const handleNew = () => {
        const entry = createEntry();
        setActiveEntry(entry);
        setPage('editor');
    };

    const handleSelect = (entry: JournalEntry | null) => {
        setActiveEntry(entry);
        setPage('editor');
    };

    const handleDelete = (id: string) => {
      deleteEntry(id);
      if (activeEntry?.id === id) setActiveEntry(null);
    };

    const streak = getStreak();
    const moodHistory = getMoodHistory();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar
                page={page}
                onPage={p => { setPage(p); if (p !== 'editor') setActiveEntry(null); }}
                onNew={handleNew}
                streak={streak}
                moodHistory={moodHistory}
            />

            <main className="flex flex-1 min-w-0 overflow-hidden">
                {page === "editor" && (
                    <EditorPage 
                        entries={entries}
                        activeEntry={activeEntry}
                        onSave={saveEntry}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                        streak={streak}
                        moodHistory={moodHistory}
                />)}
                {page === "insights" && <InsightsPage entries={entries} />}
                {page === "history" && (
                    <HistoryPage
                        entries={entries}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                    />
                )}
            </main>
        </div>
    );
}
