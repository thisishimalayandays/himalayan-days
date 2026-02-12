'use client';

import { cn } from '@/lib/utils';

interface InquiryAvatarProps {
    name: string;
    className?: string;
}

export function InquiryAvatar({ name, className }: InquiryAvatarProps) {
    const initials = name
        ? name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '??';

    // Simple deterministic color based on name length to ensure consistent colors for the same name
    const colors = [
        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
        'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
        'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
        'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
    ];

    // Use sum of char codes for better distribution than just length
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = charSum % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background shadow-sm", colorClass, className)}>
            {initials}
        </div>
    );
}
