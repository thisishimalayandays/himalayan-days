/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Day {
    dayNumber: number;
    title: string;
    description: string;
    meals?: string;
    stay?: string;
}

interface ItineraryData {
    clientName: string;
    travelDate: string;
    duration: string;
    quoteId: string;
    pkgTitle: string;
    days: Day[];
    totalCost: string;
}

const LOGO_URL = "https://himalayandays.in/Himalayan%20Days%20Logo.png";

// Export memoized component to prevent re-renders unless data changes
export const ItineraryHTMLPreview = React.memo(ItineraryHTMLPreviewComponent);

function ItineraryHTMLPreviewComponent({ data }: { data: ItineraryData }) {
    return (
        <div className="w-full h-full bg-white text-black font-sans p-8 overflow-y-auto shadow-lg relative">
            {/* ... content ... */}

            {/* Aspect Ratio simulation for A4 if needed, but scrolling is better for preview */}

            {/* Header */}
            <div className="flex justify-between border-b pb-4 mb-6 border-gray-200">
                <div>
                    <img src={LOGO_URL} alt="Logo" className="w-24 h-10 object-contain" />
                </div>
                <div className="text-right">
                    <h2 className="text-base font-bold text-orange-600">Himalayan Days</h2>
                    <p className="text-[10px] text-gray-500 mt-1">Kashmir Tour & Travel Agency</p>
                    <p className="text-[10px] text-gray-500">+91-9103901803 | info@himalayandays.in</p>
                </div>
            </div>

            {/* Title */}
            <div className="mb-6 mt-2">
                <h1 className="text-2xl font-bold text-gray-900">{data.pkgTitle || "Custom Itinerary"}</h1>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Experience Heaven on Earth</p>
            </div>

            {/* Client Info Grid */}
            <div className="flex justify-between bg-gray-50 p-3 rounded mb-6">
                <div>
                    <p className="text-[9px] text-gray-400 uppercase font-semibold">Prepared For</p>
                    <p className="text-[11px] text-gray-700 font-bold mt-1">{data.clientName || "Valued Guest"}</p>
                </div>
                <div>
                    <p className="text-[9px] text-gray-400 uppercase font-semibold">Travel Date</p>
                    <p className="text-[11px] text-gray-700 font-bold mt-1">{data.travelDate || "TBD"}</p>
                </div>
                <div>
                    <p className="text-[9px] text-gray-400 uppercase font-semibold">Duration</p>
                    <p className="text-[11px] text-gray-700 font-bold mt-1">{data.duration || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[9px] text-gray-400 uppercase font-semibold">Quote ID</p>
                    <p className="text-[11px] text-gray-700 font-bold mt-1">{data.quoteId}</p>
                </div>
            </div>

            {/* Itinerary */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-3 border-l-4 border-orange-600 pl-2">Your Itinerary</h3>
                <div className="space-y-3">
                    {data.days.map((day, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100">
                            <div className="flex items-center mb-2">
                                <span className="bg-orange-600 text-white text-[9px] px-2 py-0.5 rounded mr-2 font-bold">
                                    Day {day.dayNumber}
                                </span>
                                <span className="text-[11px] font-bold text-gray-700">{day.title}</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed mb-2 whitespace-pre-wrap">
                                {day.description}
                            </p>
                            <div className="flex border-t border-gray-200 pt-2 mt-2 gap-4">
                                <span className="text-[9px] text-gray-500">
                                    Meals: <span className="font-medium">{day.meals || "Not included"}</span>
                                </span>
                                <span className="text-[9px] text-gray-500">
                                    Stay: <span className="font-medium">{day.stay || "Standard Hotel"}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Costing */}
            <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-medium">Total Package Cost</p>
                    <p className="text-xl font-bold text-orange-600 text-right">Rs. {data.totalCost || "0"}</p>
                </div>
                <p className="text-[9px] text-gray-400 text-right mt-1">*Includes all taxes & service charges</p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-200 text-center">
                <p className="text-[9px] text-gray-400">Himalayan Days - Malabagh, Naseem Bagh, Srinagar, J&K 190006</p>
                <p className="text-[9px] text-gray-400">www.himalayandays.in</p>
            </div>

        </div>
    );
};
