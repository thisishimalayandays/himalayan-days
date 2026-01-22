'use client';

import { motion } from 'framer-motion';

export function WhatsAppButton() {
    const phoneNumber = '918825039323';
    const message = 'Hello! I am interested in planning a memorable trip to Kashmir with Himalayan Days. Could you please assist me with packages and details?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Chat on WhatsApp"
        >
            <img
                src="/whatsappicon.png"
                alt="WhatsApp"
                className="w-14 h-14 md:w-16 md:h-16 drop-shadow-2xl"
            />
            <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                Chat with us
            </span>
        </motion.a>
    );
}
