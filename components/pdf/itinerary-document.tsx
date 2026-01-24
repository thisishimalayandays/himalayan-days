/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (using standard fonts for speed now)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
    },
    logo: {
        width: 100,
        height: 40,
        objectFit: 'contain',
    },
    agencyInfo: {
        textAlign: 'right',
    },
    agencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ea580c', // Orange-600
    },
    agencyText: {
        fontSize: 9,
        color: '#6B7280',
        marginTop: 2,
    },
    titleSection: {
        marginBottom: 20,
        marginTop: 10,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    subTitle: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 4,
    },
    clientInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
    clientLabel: {
        fontSize: 8,
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    clientValue: {
        fontSize: 10,
        color: '#374151',
        fontWeight: 'bold',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#ea580c',
        paddingLeft: 6,
    },
    dayContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#F8F9FA',
        borderRadius: 4,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayBadge: {
        backgroundColor: '#ea580c',
        color: '#FFFFFF',
        fontSize: 8,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        marginRight: 6,
    },
    dayTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#374151',
    },
    dayDesc: {
        fontSize: 9,
        color: '#4B5563',
        lineHeight: 1.4,
        marginBottom: 6,
    },
    dayMeta: {
        flexDirection: 'row',
        marginTop: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    metaItem: {
        fontSize: 8,
        color: '#6B7280',
        marginRight: 10,
    },
    priceSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FFF7ED', // Orange-50
        borderRadius: 6,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ea580c',
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: '#9CA3AF',
    }
});

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

// NOTE: Images must be absolute URLs or base64. 
// For now, we use a placeholder or public absolute path if env is set.
const LOGO_URL = "https://himalayandays.in/Himalayan%20Days%20Logo.png";

export function ItineraryDocument({ data }: { data: ItineraryData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image src={LOGO_URL} style={styles.logo} />
                    </View>
                    <View style={styles.agencyInfo}>
                        <Text style={styles.agencyTitle}>Himalayan Days</Text>
                        <Text style={styles.agencyText}>Kashmir Tour & Travel Agency</Text>
                        <Text style={styles.agencyText}>+91-9103901803 | info@himalayandays.in</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>{data.pkgTitle || "Custom Itinerary"}</Text>
                    <Text style={styles.subTitle}>Experience Heaven on Earth</Text>
                </View>

                {/* Client Info Grid */}
                <View style={styles.clientInfo}>
                    <View>
                        <Text style={styles.clientLabel}>Prepared For</Text>
                        <Text style={styles.clientValue}>{data.clientName || "Valued Guest"}</Text>
                    </View>
                    <View>
                        <Text style={styles.clientLabel}>Travel Date</Text>
                        <Text style={styles.clientValue}>{data.travelDate || "TBD"}</Text>
                    </View>
                    <View>
                        <Text style={styles.clientLabel}>Duration</Text>
                        <Text style={styles.clientValue}>{data.duration || "N/A"}</Text>
                    </View>
                    <View>
                        <Text style={styles.clientLabel}>Quote ID</Text>
                        <Text style={styles.clientValue}>{data.quoteId}</Text>
                    </View>
                </View>

                {/* Itinerary */}
                <View>
                    <Text style={styles.sectionTitle}>Your Itinerary</Text>
                    {data.days.map((day, idx) => (
                        <View key={idx} style={styles.dayContainer}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayBadge}>Day {day.dayNumber}</Text>
                                <Text style={styles.dayTitle}>{day.title}</Text>
                            </View>
                            <Text style={styles.dayDesc}>{day.description}</Text>
                            <View style={styles.dayMeta}>
                                <Text style={styles.metaItem}>🍽️ Meal Plan: {day.meals || "Not included"}</Text>
                                <Text style={styles.metaItem}>🏨 Stay: {day.stay || "Standard Hotel"}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Costing */}
                <View style={styles.priceSection}>
                    <Text style={styles.agencyText}>Total Package Cost</Text>
                    <Text style={styles.totalPrice}>₹ {data.totalCost || "0"}</Text>
                    <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 4, textAlign: 'right' }}>
                        *Includes all taxes & service charges
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Himalayan Days - Malabagh, Naseem Bagh, Srinagar, J&K 190006
                    </Text>
                    <Text style={styles.footerText}>
                        www.himalayandays.in
                    </Text>
                </View>

            </Page>
        </Document>
    );
};
