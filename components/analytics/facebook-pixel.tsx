'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import * as analytics from '@/lib/analytics';

export function FacebookPixel() {
    const [loaded, setLoaded] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (!loaded) return;
        analytics.pageview();
    }, [pathname, loaded]);

    return (
        <div>
            <Script
                id="fb-pixel"
                src="/scripts/pixel.js"
                strategy="afterInteractive"
                onLoad={() => setLoaded(true)}
                onError={(e) => console.error('FB Pixel Script failed to load', e)}
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analytics.FB_PIXEL_ID}');
          `,
                }}
            />
        </div>
    );
}
