'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, UserCheck } from 'lucide-react';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Gujarat', 'Kolkata', 'Hyderabad'];
const NAMES = ['Amit', 'Rahul', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Rohit', 'A family'];
const ACTIONS = ['inquired about this trip', 'just checked dates', 'is planning a trip'];

export function RecentActivityToast() {
    const [notification, setNotification] = useState<{ name: string; city: string; action: string } | null>(null);

    useEffect(() => {
        // Initial delay
        const initialTimer = setTimeout(() => {
            triggerNotification();
        }, 5000);

        // Recursive timer
        const triggerNotification = () => {
            const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
            const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
            const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

            setNotification({ name: randomName, city: randomCity, action: randomAction });

            // Hide after 5 seconds
            setTimeout(() => {
                setNotification(null);

                // Schedule next one (between 15-30 seconds)
                const nextDelay = Math.random() * (30000 - 15000) + 15000;
                setTimeout(triggerNotification, nextDelay);
            }, 5000);
        };

        return () => clearTimeout(initialTimer);
    }, []);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, x: -20, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: 20 }}
                    className="fixed left-4 right-4 md:right-auto md:left-6 bottom-24 md:bottom-8 z-40 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-emerald-100 py-2.5 px-3 rounded-2xl md:rounded-full flex items-center gap-3 w-auto md:max-w-sm mx-auto md:mx-0 overflow-hidden"
                >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-xs md:text-sm text-gray-800 leading-snug truncate">
                            <span className="font-bold text-gray-900">{notification.name}</span> from <span className="font-semibold">{notification.city}</span>
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {notification.action} • Just now
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
