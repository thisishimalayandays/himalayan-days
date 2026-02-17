import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        padding: 30, // Reduced padding
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        color: '#111827',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 15,
        alignItems: 'center'
    },
    logo: {
        width: 80,
        height: 'auto',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2,
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 9,
        color: '#374151',
    },
    totalSection: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 180,
        marginBottom: 4,
    },
    footer: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
    },
    termsText: {
        fontSize: 7,
        color: '#6B7280',
        lineHeight: 1.4,
        marginBottom: 2
    }
});

interface BookingPDFProps {
    booking: any;
}

export const BookingPDF = ({ booking }: BookingPDFProps) => {
    const createdDate = booking?.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy');
    const travelDate = booking?.travelDate ? format(new Date(booking.travelDate), 'dd MMM yyyy') : 'TBD';

    // Ensure payments is an array
    const payments = Array.isArray(booking?.payments) ? booking.payments : [];

    // Calculate totals dynamically from payments
    const totalPaid = payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0) + (booking?.initialPayment || 0);
    // Note: If payments array includes the initial payment, we shouldn't add it twice. 
    // Usually initialPayment is just a record, and payments array tracks transactions. 
    // Assuming payments array is the source of truth for history. 
    // If payments is empty (e.g. create mode), use initialPayment.
    // If Payments exist, trust them.

    const displayPaid = payments.length > 0 ? payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0) : (booking?.initialPayment || 0);

    const total = booking?.totalAmount || 0;
    const balance = total - displayPaid;

    const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Logo */}
                        <Image src={logoUrl} style={{ width: 80, height: 80, marginRight: 10, objectFit: 'contain' }} />
                        {/* Brand Text */}
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Himalayan Days</Text>
                            <Text style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Experience Kashmir</Text>
                            <Text style={{ fontSize: 7, color: '#9CA3AF', marginTop: 2 }}>Regd. with J&K Tourism</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534' }}>INVOICE</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 4 }}>#{booking?.id?.slice(-8).toUpperCase()}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280' }}>Date: {createdDate}</Text>
                    </View>
                </View>

                {/* Customer & Trip Info */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.sectionTitle}>Bill To</Text>
                        <Text style={styles.value}>{booking?.customer?.name}</Text>
                        <Text style={styles.label}>{booking?.customer?.email}</Text>
                        <Text style={styles.label}>{booking?.customer?.phone}</Text>
                        <Text style={{ fontSize: 9, color: '#374151', marginTop: 4 }}>
                            {booking?.customer?.address || 'Address not provided'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={styles.sectionTitle}>Trip Details</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Package</Text>
                                <Text style={styles.value}>{booking?.title || 'Custom Trip'}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Duration</Text>
                                <Text style={styles.value}>{booking?.duration}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Travel Date</Text>
                                <Text style={styles.value}>{travelDate}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Guests</Text>
                                <Text style={styles.value}>{booking?.adults} Adults, {booking?.kids} Kids</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bill Details */}
                <Text style={styles.sectionTitle}>Invoice Details</Text>

                {/* DYNAMIC HOTEL DETAILS SECTION */}
                {(() => {
                    let hotelItems: any[] = [];
                    let hotelText = "";
                    try {
                        if (booking?.hotelInfo?.startsWith("[")) {
                            hotelItems = JSON.parse(booking.hotelInfo);
                        } else {
                            hotelText = booking?.hotelInfo || "";
                        }
                    } catch (e) { hotelText = booking?.hotelInfo || ""; }

                    if (hotelItems.length > 0) {
                        return (
                            <View style={styles.section}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4, color: '#374151' }}>Accommodation Details</Text>
                                <View style={[styles.table, { marginBottom: 10 }]}>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>Hotel</Text>
                                        <Text style={[styles.tableCell, { flex: 1.5 }]}>Room</Text>
                                        <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>Plan</Text>
                                        <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>Nights</Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>Rooms</Text>
                                    </View>
                                    {hotelItems.map((item, i) => (
                                        <View key={i} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.name} <Text style={{ fontSize: 7, color: '#9CA3AF' }}>({item.location})</Text></Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.roomTypeName || item.roomTypeId || '-'}</Text>
                                            <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>{item.plan}</Text>
                                            <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>{item.nights}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.rooms}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    } else if (hotelText) {
                        return (
                            <View style={styles.section}>
                                <Text style={styles.label}>Accommodation</Text>
                                <Text style={styles.value}>{hotelText}</Text>
                            </View>
                        );
                    }
                    return null;
                })()}

                {/* DYNAMIC TRANSPORT DETAILS SECTION */}
                {(() => {
                    let transportItems: any[] = [];
                    let transportText = "";
                    try {
                        if (booking?.transportInfo?.startsWith("[")) {
                            transportItems = JSON.parse(booking.transportInfo);
                        } else {
                            transportText = booking?.transportInfo || "";
                        }
                    } catch (e) { transportText = booking?.transportInfo || ""; }

                    if (transportItems.length > 0) {
                        return (
                            <View style={styles.section}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4, color: '#374151' }}>Transport Details</Text>
                                <View style={[styles.table, { marginBottom: 10 }]}>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableCell, { flex: 3 }]}>Vehicle</Text>
                                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>Days</Text>
                                    </View>
                                    {transportItems.map((item, i) => (
                                        <View key={i} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 3 }]}>{item.type}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.days}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    } else if (transportText) {
                        return (
                            <View style={styles.section}>
                                <Text style={styles.label}>Transport</Text>
                                <Text style={styles.value}>{transportText}</Text>
                            </View>
                        );
                    }
                    return null;
                })()}

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>Amount</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 3 }]}>Package Total Cost ({booking?.title || 'Trip'})</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>Rs. {total.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Total Summary */}
                <View style={styles.totalSection}>
                    <View>
                        <View style={styles.totalRow}>
                            <Text style={styles.label}>Total Amount:</Text>
                            <Text style={styles.value}>Rs. {total.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer / Terms */}
                <View style={styles.footer}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6 }}>Terms & Conditions</Text>
                    <View>
                        <Text style={styles.termsText}>1. All bookings are subject to availability and confirmation by Himalayan Days.</Text>
                        <Text style={styles.termsText}>2. 50% advance payment is required to confirm the booking. Balance must be paid upon arrival.</Text>
                        <Text style={styles.termsText}>3. Cancellations made 30 days prior to travel date will receive 100% refund.</Text>
                        <Text style={styles.termsText}>4. Cancellations made within 15-30 days will incur 50% cancellation charges.</Text>
                        <Text style={styles.termsText}>5. No refund for cancellations made within 15 days of travel date.</Text>
                        <Text style={styles.termsText}>6. Himalayan Days reserves the right to change itinerary due to weather conditions or unforeseen circumstances.</Text>
                    </View>

                    <Text style={[styles.termsText, { marginTop: 8, fontStyle: 'italic' }]}>
                        This is a computer-generated invoice and does not require a physical signature.
                    </Text>

                    <View style={{ marginTop: 15, alignItems: 'center' }}>
                        <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center' }}>Himalayan Days/Kashmir Tour and Travel Agency</Text>
                        <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>Malabagh, Naseem bagh, Omer Colony B, Lal Bazar, Srinagar, Jammu and Kashmir 190006</Text>
                        <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>+91-9103901803</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
