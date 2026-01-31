'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import * as analytics from '@/lib/analytics';

export function NewsletterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await subscribeToNewsletter(null, formData);

            if (result.success) {
                toast({
                    title: "Subscribed!",
                    description: result.message,
                    variant: "default",
                    className: "bg-green-600 text-white border-none"
                });

                // Track Registration
                analytics.event('CompleteRegistration', {
                    content_name: 'Newsletter Signup'
                });

                // Reset form
                (document.getElementById('newsletter-form') as HTMLFormElement)?.reset();
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to connect to server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="newsletter-form" action={handleSubmit} className="flex gap-2">
            <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="bg-gray-900 border-none rounded-md px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-gray-500"
            />
            <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="bg-primary hover:bg-orange-600 shrink-0 text-white font-medium"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
            </Button>
        </form>
    );
}
