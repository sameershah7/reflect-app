import React from 'react';
import { type Mood } from '../types/journal';

const CONFIG: Record<Mood, { label: string; classes: string }> = {
    happy:      { label: 'happy',      classes: 'bg-green-100 text-green-800' },
    calm:       { label: 'calm',       classes: 'bg-teal-100 text-teal-800' },
    anxious:    { label: 'anxious',    classes: 'bg-amber-100 text-amber-800' },
    sad:        { label: 'sad',        classes: 'bg-blue-100 text-blue-800' },
    excited:    { label: 'excited',    classes: 'bg-pink-100 text-pink-800' },
    reflective: { label: 'reflective', classes: 'bg-purple-100 text-purple-800' },
    neutral:    { label: 'neutral',    classes: 'bg-gray-100 text-gray-600' },
};

export const MOOD_DOT: Record<Mood, string> = {
    happy: '#639922', calm: '#0F6E56', anxious: '#854F0B',
    sad: '#185FA5', excited: '#993556', reflective: '#534AB7', neutral: '#5F5E5A',
};

export const MOOD_LIGHT: Record<Mood, string> = {
    happy: '#C0DD97', calm: '#9FE1CB', anxious: '#FAC775',
    sad: '#85B7EB', excited: '#ED93B1', reflective: '#CECBF6', neutral: '#D3D1C7',
};

interface Props {
    mood: Mood;
    size?: 'sm' | 'md';
}

export default function MoodBadge({ mood, size = 'md' }: Props) {
    const { label, classes } = CONFIG[mood];
    const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
    return (
        <span className={`inline-flex items-center rounded-full font-medium ${px} ${classes}`}>
            {label}
        </span>
    );
}
