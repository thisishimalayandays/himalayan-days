/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

const LOGO_URL = "https://himalayandays.in/Himalayan%20Days%20Logo.png";



const ItineraryHTMLPreviewComponent = ({ data }: { data: ItineraryData }) => {
    // Helper to format date consistent with PDF
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) { return dateStr }
    };

    return (
        <div id="itinerary-preview" className="w-full h-full bg-white text-gray-900 font-sans p-10 overflow-hidden relative shadow-sm flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-orange-600">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-orange-600 uppercase tracking-widest leading-none">Himalayan Days</h1>
                    <span className="text-xs text-gray-500 font-medium tracking-widest mt-1">Kashmir Tour & Travel Experts</span>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-0.5">
                    <p>+91-9103901803</p>
                    <p>info@himalayandays.in</p>
                    <p>www.himalayandays.in</p>
                </div>
            </div>

            {/* Title Section */}
            <div className="mb-8 pl-1">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Exclusive Itinerary For</p>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">{data.pkgTitle || "Kashmir Tour Package"}</h2>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-3 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
                {/* Column 1 */}
                <div>
                    <div className="mb-4">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Guest Name</p>
                        <p className="text-sm font-bold text-gray-900">{data.clientName || "-"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Travel Date</p>
                        <p className="text-sm font-bold text-gray-900">{formatDate(data.travelDate)}</p>
                    </div>
                </div>
                {/* Column 2 */}
                <div>
                    <div className="mb-4">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Duration</p>
                        <p className="text-sm font-bold text-gray-900">{data.duration || "-"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Adults / Kids</p>
                        <p className="text-sm font-bold text-gray-900">{data.adults || 0} Adults, {data.kids || 0} Kids</p>
                    </div>
                </div>
                {/* Column 3 */}
                <div className="border-l border-gray-200 pl-6">
                    <div className="mb-4">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Quote Reference</p>
                        <p className="text-sm font-bold text-gray-900 font-mono text-orange-600">{data.quoteId}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Vehicle Type</p>
                        <p className="text-sm font-bold text-gray-900">{data.vehicleType || "Private Cab"}</p>
                    </div>
                </div>
            </div>

            {/* Journey Roadmap (Timeline) */}
            <div className="mb-12 flex-1">
                <div className="border-b border-gray-200 mb-6 pb-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Journey Roadmap</h3>
                </div>

                <div className="space-y-0">
                    {data.days.map((day, idx) => (
                        <div key={idx} className="flex relative pb-8 last:pb-0">
                            {/* Timeline Line */}
                            {idx !== data.days.length - 1 && (
                                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200"></div>
                            )}

                            {/* Badge */}
                            <div className="flex-shrink-0 w-8 mr-6 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {day.dayNumber}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1.5">
                                <h4 className="text-base font-bold text-gray-900 mb-2">{day.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">{day.description}</p>

                                {/* Meta Tags */}
                                {(day.meals || day.stay) && (
                                    <div className="flex flex-wrap gap-2">
                                        {day.stay && (
                                            <span className="inline-flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-600">
                                                🏨 {day.stay}
                                            </span>
                                        )}
                                        {day.meals && (
                                            <span className="inline-flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-600">
                                                🍽️ {day.meals}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price & Footer */}
            <div className="mt-auto">
                <div className="flex flex-col items-end mb-8">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Tour Cost</p>
                    <p className="text-3xl font-bold tracking-tight text-gray-900">₹ {data.totalCost || "0"}/-</p>
                    <p className="text-[10px] text-gray-500 italic mt-1">*Valid for 7 days from issue. Includes all taxes.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                    <p>© 2026 Himalayan Days. All rights reserved.</p>
                    <p>Page 1 of 1</p>
                </div>
            </div>

        </div>
    );
};

// Export memoized component to prevent re-renders unless data changes
export const ItineraryHTMLPreview = React.memo(ItineraryHTMLPreviewComponent);
