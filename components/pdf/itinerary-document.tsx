/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

// Register fonts if needed (using standard fonts for speed now)
// Font.register({ family: 'Inter', src: '...' });

// Colors
const COLORS = {
    primary: '#111827', // Gray 900
    secondary: '#4b5563', // Gray 600
    accent: '#ea580c', // Orange 600 (Saffron)
    lightBg: '#f9fafb', // Gray 50
    border: '#e5e7eb', // Gray 200
    white: '#ffffff',
};

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: COLORS.white,
        padding: 40,
        fontFamily: 'Helvetica',
        color: COLORS.primary,
        fontSize: 10,
        lineHeight: 1.5,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.accent,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    brandTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.accent,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    brandSubtitle: {
        fontSize: 8,
        color: COLORS.secondary,
        marginTop: 8,
        letterSpacing: 1,
        marginBottom: 8,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    contactText: {
        fontSize: 8,
        color: COLORS.secondary,
        marginBottom: 2,
    },
    // Title Section
    titleSection: {
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 28, // Large impact
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 12,
        color: COLORS.accent,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Client Grid
    clientGrid: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightBg,
        borderRadius: 8,
        padding: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    clientCol: {
        flex: 1,
        paddingRight: 10,
    },
    label: {
        fontSize: 8,
        color: COLORS.secondary,
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    // Itinerary Timeline
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 8,
    },
    dayContainer: {
        flexDirection: 'row',
        marginBottom: 0,
        position: 'relative',
    },
    timelineLeft: {
        width: 50,
        alignItems: 'center',
    },
    timelineLine: {
        position: 'absolute',
        top: 15,
        left: 24.5, // Center of width 50
        bottom: -15, // Extend to next item
        width: 1,
        backgroundColor: COLORS.border,
    },
    timelineLineLast: {
        display: 'none',
    },
    dayBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 10,
    },
    dayNumber: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    dayContent: {
        flex: 1,
        paddingBottom: 30,
    },
    dayTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 6,
    },
    dayDesc: {
        fontSize: 10,
        color: COLORS.secondary,
        marginBottom: 10,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    metaItem: {
        backgroundColor: COLORS.lightBg,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    metaText: {
        fontSize: 8,
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    // Pricing
    priceSection: {
        marginTop: 20,
        padding: 20,
        backgroundColor: COLORS.primary, // Dark bg
        borderRadius: 8,
        flexDirection: 'row', // Flex row for left-right balance
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
    },
    priceLeft: {
        flexDirection: 'column',
    },
    priceLabel: {
        color: '#9ca3af', // Gray 400
        fontSize: 10,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    priceSub: {
        color: '#6b7280',
        fontSize: 8,
        fontStyle: 'italic',
    },
    priceValue: {
        color: COLORS.white,
        fontSize: 28, // Lager font
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
    },
    // Terms
    termsContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    termsHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 4,
    },
    termItem: {
        fontSize: 7, // Small legible font
        color: COLORS.secondary,
        marginBottom: 4,
        lineHeight: 1.4,
    },
});

export function ItineraryDocument({ data }: { data: ItineraryData }) {

    // Formatting helper
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) { return dateStr }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.brandTitle}>HIMALAYAN DAYS</Text>
                        <Text style={styles.brandSubtitle}>KASHMIR TOUR & TRAVEL EXPERTS</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.contactText}>+91-9103901803</Text>
                        <Text style={styles.contactText}>thisishimalayandays@gmail.com</Text>
                        <Text style={styles.contactText}>www.himalayandays.in</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.subTitle}>EXCLUSIVE ITINERARY FOR</Text>
                    <Text style={styles.mainTitle}>{data.pkgTitle || "Kashmir Tour Package"}</Text>
                </View>

                {/* Client Grid */}
                <View style={styles.clientGrid}>
                    <View style={styles.clientCol}>
                        <Text style={styles.label}>Guest Name</Text>
                        <Text style={styles.value}>{data.clientName || "-"}</Text>

                        <Text style={styles.label}>Travel Date</Text>
                        <Text style={styles.value}>{formatDate(data.travelDate)}</Text>
                    </View>
                    <View style={styles.clientCol}>
                        <Text style={styles.label}>Duration</Text>
                        <Text style={styles.value}>{data.duration || "-"}</Text>

                        <Text style={styles.label}>Adults / Kids</Text>
                        <Text style={styles.value}>{data.adults || 0} Adults, {data.kids || 0} Kids</Text>
                    </View>
                    <View style={{ ...styles.clientCol, borderRightWidth: 0 }}>
                        <Text style={styles.label}>Quote Reference</Text>
                        <Text style={styles.value}>{data.quoteId}</Text>

                        <Text style={styles.label}>Vehicle Type</Text>
                        <Text style={styles.value}>{data.vehicleType || "Private Cab"}</Text>
                    </View>
                </View>

                {/* Timeline Itinerary */}
                <View>
                    <Text style={styles.sectionHeader}>Journey Roadmap</Text>

                    {data.days.map((day, idx) => {
                        const isLast = idx === data.days.length - 1;
                        return (
                            <View key={idx} style={styles.dayContainer} wrap={false}>
                                {/* Left: Timeline Graphic */}
                                <View style={styles.timelineLeft}>
                                    {!isLast && <View style={styles.timelineLine} />}
                                    <View style={styles.dayBadge}>
                                        <Text style={styles.dayNumber}>{day.dayNumber}</Text>
                                    </View>
                                </View>

                                {/* Right: Content */}
                                <View style={styles.dayContent}>
                                    <Text style={styles.dayTitle}>{day.title}</Text>
                                    <Text style={styles.dayDesc}>{day.description}</Text>

                                    {/* Meta Tags */}
                                    {(day.meals || day.stay) && (
                                        <View style={styles.metaContainer}>
                                            {day.stay && (
                                                <View style={styles.metaItem}>
                                                    <Text style={styles.metaText}>Stay: {day.stay}</Text>
                                                </View>
                                            )}
                                            {day.meals && (
                                                <View style={styles.metaItem}>
                                                    <Text style={styles.metaText}>Meals: {day.meals}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Inclusions & Exclusions */}
                <View style={{ marginBottom: 20, marginTop: 10 }} wrap={false}>
                    {/* Header Row */}
                    <View style={{ flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 0 }}>
                        <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#374151' }}>
                            <Text style={{ color: COLORS.accent, fontSize: 9, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Inclusions</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#9ca3af', fontSize: 9, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Exclusions</Text>
                        </View>
                    </View>

                    {/* Table Body */}
                    {[
                        { inc: 'Hotel / Houseboat', exc: 'Airfare' },
                        { inc: 'Breakfast & Dinner', exc: 'Lunch' },
                        { inc: 'Shikara Ride', exc: 'Pony Ride' },
                        { inc: 'All transfers and Srinagar Sightseeing', exc: 'Gandola Ride' },
                        { inc: 'Local Shopping Assistance', exc: 'Entrance Tickets & Activities' },
                    ].map((row, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                            <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: '#f3f4f6' }}>
                                <Text style={{ fontSize: 9, color: COLORS.secondary, textAlign: 'center' }}>{row.inc}</Text>
                            </View>
                            <View style={{ flex: 1, padding: 8 }}>
                                <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center' }}>{row.exc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Terms & Conditions */}
                <View style={styles.termsContainer} wrap={false}>
                    <Text style={styles.termsHeader}>Terms & Conditions</Text>
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
                        <Text key={idx} style={styles.termItem}>• {term}</Text>
                    ))}
                </View>

                {/* Cost Section (Keep on same page if possible, or wrap) */}
                {/* Cost Section */}
                <View style={styles.priceSection} wrap={false}>
                    <View style={styles.priceLeft}>
                        <Text style={styles.priceLabel}>TOTAL TOUR COST</Text>
                        <Text style={styles.priceSub}>*Valid for 7 days. Includes all taxes.</Text>
                    </View>
                    <Text style={styles.priceValue}>Rs. {data.totalCost || "0"}/-</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>© 2026 Himalayan Days. All rights reserved.</Text>
                    <Text style={styles.footerText}>Page <Text render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} /></Text>
                </View>

            </Page>
        </Document>
    );
};
