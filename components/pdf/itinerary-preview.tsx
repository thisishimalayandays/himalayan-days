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
                    <p>thisishimalayandays@gmail.com</p>
                    <p>www.himalayandays.in</p>
                </div>
            </div>

            {/* Title Section */}
            <div className="mb-8 pl-1">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Exclusive Itinerary For</p>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">{data.clientName || "Valued Guest"}</h2>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-3 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
                {/* Column 1 */}
                <div>
                    <div className="mb-4">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Package Name</p>
                        <p className="text-sm font-bold text-gray-900">{data.pkgTitle || "Kashmir Tour Package"}</p>
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
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Vehicle / Rooms</p>
                        <p className="text-sm font-bold text-gray-900">
                            {data.vehicleType || "Private Cab"}
                            {data.rooms ? <span className="text-gray-500 font-normal"> • {data.rooms}</span> : ""}
                        </p>
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
                                                Stay: {day.stay}
                                            </span>
                                        )}
                                        {day.meals && (
                                            <span className="inline-flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-600">
                                                Meals: {day.meals}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="mb-0 p-0">
                {/* Header Row */}
                <div className="flex bg-gray-900">
                    <div className="flex-1 py-3 px-4 border-r border-gray-700">
                        <h3 className="text-orange-500 text-[10px] font-bold text-center uppercase tracking-widest">Inclusions</h3>
                    </div>
                    <div className="flex-1 py-3 px-4">
                        <h3 className="text-gray-400 text-[10px] font-bold text-center uppercase tracking-widest">Exclusions</h3>
                    </div>
                </div>
                {/* Body */}
                <div className="border border-t-0 border-gray-100 mb-8">
                    {[
                        { inc: 'Hotel / Houseboat', exc: 'Airfare' },
                        { inc: 'Breakfast & Dinner', exc: 'Lunch' },
                        { inc: 'Shikara Ride', exc: 'Pony Ride' },
                        { inc: 'All transfers and Srinagar Sightseeing', exc: 'Gandola Ride' },
                        { inc: 'Local Shopping Assistance', exc: 'Entrance Tickets & Activities' },
                    ].map((row, idx) => (
                        <div key={idx} className={`flex border-b border-gray-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <div className="flex-1 py-2 px-4 border-r border-gray-100 flex items-center justify-center">
                                <span className="text-[10px] font-medium text-gray-700 text-center">{row.inc}</span>
                            </div>
                            <div className="flex-1 py-2 px-4 flex items-center justify-center">
                                <span className="text-[10px] font-medium text-gray-400 text-center">{row.exc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8 bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Terms & Conditions</h3>
                <ul className="space-y-1.5 list-disc pl-3">
                    {[
                        "From your first contact till your Tour ends, our Tour Advisors are available for your assistance 24x7.",
                        "Customers are requested to pay 30% of the total booking amount in advance & 70% upon arrival.",
                        "All bookings will be confirmed after the advance payment reflects in our bank account or online wallets.",
                        "In case of a government-imposed lockdown, your booking amount is safe with us and can be used in the future.",
                        "In case you choose to cancel your bookings with us after confirming, we trust you to pay the remaining amount over the advance payments made by you as per the hotel policies. Himalayan Days will not charge you anything as Tour Operators for cancellations except the Hotel & Driver charges after settlements.",
                        "Kindly make the Advance Payments soon after finalizing your desired Itinerary. This helps us ensure that the Hotels/Houseboats are not Sold Out.",
                        "All Visitors are bound to Hire Local Taxis for Sightseeing within the vicinities of Sonmarg, Pahalgam, Gulmarg & other destinations in Kashmir as per Kashmir Tourism Advisory.",
                        "Your Prepaid Sim cards will not work on your Trip to Kashmir & Ladakh, kindly arrange a Postpaid/Pre-on-Postpaid Sim on your own beforehand."
                    ].map((term, idx) => (
                        <li key={idx} className="text-[9px] text-gray-500 leading-relaxed pl-1">
                            <span className="text-gray-600">{term}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Payment Section */}
            {data.upiId && (
                <div className="mb-6 border-t border-gray-200 pt-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wider">Scan to Pay</p>
                        <p className="text-[10px] text-gray-500 mb-2">Use any UPI app to make the secure payment.</p>
                        <p className="text-sm font-bold text-orange-600 font-mono">{data.upiId}</p>
                    </div>
                    <img
                        src={`https://quickchart.io/qr?text=${encodeURIComponent(`upi://pay?pa=${data.upiId}&pn=Himalayan Days`)}&size=150`}
                        alt="UPI QR"
                        className="w-24 h-24 border border-gray-200 p-1 rounded-sm"
                    />
                </div>
            )}

            {/* Price & Footer */}
            <div className="mt-auto">
                <div className="bg-gray-900 rounded-lg p-5 flex items-center justify-between border-l-4 border-orange-600 mb-8 shadow-sm">
                    <div className="flex flex-col">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Tour Cost</p>
                        <p className="text-[10px] text-gray-500 italic">*Valid for 7 days. Includes all taxes.</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold tracking-tight text-white">Rs. {data.totalCost || "0"}/-</p>
                    </div>
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
