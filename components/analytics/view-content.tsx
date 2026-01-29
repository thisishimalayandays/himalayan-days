'use client';

import { useEffect } from 'react';
import * as analytics from '@/lib/analytics';

interface ViewContentProps {
    id: string;
    name: string;
    price: number;
    currency?: string;
}

export function ViewContent({ id, name, price, currency = 'INR' }: ViewContentProps) {
    useEffect(() => {
        analytics.event('ViewContent', {
            content_name: name,
            content_ids: [id],
            content_type: 'product',
            value: price,
            currency: currency,
        });
    }, [id, name, price, currency]);

    return null;
}
