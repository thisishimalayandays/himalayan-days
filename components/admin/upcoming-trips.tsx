'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Trip {
    id: string;
    title: string;
    travelDate: Date;
    duration: string | null;
    customer: {
        name: string;
        phone: string;
    };
}

export function UpcomingTrips({ trips }: { trips: Trip[] }) {
    if (!trips || trips.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Upcoming Departures
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        No upcoming trips in the next 30 days.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Departures
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {trips.map((trip) => {
                        const date = new Date(trip.travelDate);
                        const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <div key={trip.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="font-medium text-sm text-foreground flex items-center gap-2">
                                        {trip.title}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> {trip.customer.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {date.toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={daysUntil <= 3 ? "destructive" : "secondary"}>
                                        {daysUntil === 0 ? "Today" : `in ${daysUntil} days`}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
