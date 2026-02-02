import { sendGAEvent } from '@next/third-parties/google';

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'PLACEHOLDER_ID';

export const pageview = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options: { [key: string]: any } = {}) => {
    // 1. Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', name, options);
    }

    // 2. Google Analytics 4
    try {
        sendGAEvent('event', name, options);
    } catch (e) {
        console.error('GA Event Failed:', e);
    }
};
