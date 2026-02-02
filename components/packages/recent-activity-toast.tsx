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
                    className="fixed left-4 bottom-24 md:bottom-8 z-40 bg-white/95 backdrop-blur shadow-2xl border border-green-100 p-4 rounded-xl flex items-center gap-4 max-w-[300px]"
                >
                    <div className="bg-green-100 p-2 rounded-full shrink-0">
                        <UserCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {notification.name} from {notification.city}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {notification.action}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Just now
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
