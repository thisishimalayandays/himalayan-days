import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        padding: 30,
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
    titleSection: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#166534', // Green for Receipt
    },
    sectionTitle: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontWeight: 'bold',
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
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginBottom: 4,
    },
    footer: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#9CA3AF',
        marginTop: 2,
    }
});

interface PaymentReceiptProps {
    booking: any;
}

export const PaymentReceiptPDF = ({ booking }: PaymentReceiptProps) => {
    const createdDate = format(new Date(), 'dd MMM yyyy');
    const payments = Array.isArray(booking?.payments) ? booking.payments : [];

    // Calculate totals
    // If no payments array but has initialPayment (legacy/create mode), treat initialPayment as the only payment
    // But for a receipt, we really want the transaction list.
    let displayPayments = [...payments];
    if (displayPayments.length === 0 && booking?.initialPayment > 0) {
        displayPayments.push({
            amount: booking.initialPayment,
            mode: booking.paymentMode || 'Advance',
            createdAt: booking.createdAt
        });
    }

    const totalPaid = displayPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalAmount = booking?.totalAmount || 0;
    const balance = totalAmount - totalPaid;

    const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/Himalayan Days Logo.png` : '';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Logo */}
                        <Image src={logoUrl} style={{ width: 50, height: 50, marginRight: 10, objectFit: 'contain' }} />
                        {/* Brand Text */}
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Himalayan Days</Text>
                            <Text style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Experience Kashmir</Text>
                            <Text style={{ fontSize: 7, color: '#9CA3AF', marginTop: 2 }}>Regd. with J&K Tourism</Text>
                        </View>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>PAYMENT RECEIPT</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 4 }}>Ref: #{booking?.id?.slice(-8).toUpperCase()}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280' }}>Date: {createdDate}</Text>
                    </View>
                </View>

                {/* Received From */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 10, marginBottom: 4 }}>Received with thanks from:</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{booking?.customer?.name}</Text>
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>{booking?.customer?.phone}</Text>
                    <Text style={{ fontSize: 9, color: '#374151', marginTop: 2 }}>
                        Package: {booking?.title} ({booking?.duration})
                    </Text>
                </View>

                {/* Payment History Table */}
                <Text style={styles.sectionTitle}>Transaction Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Payment Date</Text>
                        <Text style={[styles.tableCell, { flex: 2, textAlign: 'center' }]}>Mode</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Reference</Text>
                        <Text style={[styles.tableCell, { flex: 2, textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {displayPayments.length > 0 ? (
                        displayPayments.map((p: any, i: number) => (
                            <View key={i} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>
                                    {p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy') : '-'}
                                </Text>
                                <Text style={[styles.tableCell, { flex: 2, textAlign: 'center' }]}>
                                    {p.mode || 'UPI'}
                                </Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>
                                    -
                                </Text>
                                <Text style={[styles.tableCell, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>
                                    Rs. {p.amount?.toLocaleString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 8, textAlign: 'center', fontStyle: 'italic' }]}>No recorded transactions</Text>
                        </View>
                    )}
                </View>

                {/* Summary */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                    <View>
                        <View style={styles.totalRow}>
                            <Text style={{ fontSize: 10, color: '#6B7280' }}>Total Amount Recieved:</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#166534' }}>Rs. {totalPaid.toLocaleString()}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={{ fontSize: 10, color: '#6B7280' }}>Balance Pending:</Text>
                            <Text style={{ fontSize: 10, color: balance > 0 ? '#DC2626' : '#6B7280' }}>
                                Rs. {balance > 0 ? balance.toLocaleString() : '0.00'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={{ fontSize: 9, fontStyle: 'italic', marginBottom: 10 }}>
                        This receipt is computer generated and valid without signature.
                    </Text>
                    <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center' }}>Himalayan Days/Kashmir Tour and Travel Agency</Text>
                    <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>Malabagh, Naseem bagh, Omer Colony B, Lal Bazar, Srinagar, Jammu and Kashmir 190006</Text>
                    <Text style={{ fontSize: 8, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>+91-9103901803</Text>
                </View>
            </Page>
        </Document>
    );
};
