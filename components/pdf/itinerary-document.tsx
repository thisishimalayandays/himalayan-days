/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

// Register Arabic font
Font.register({
    family: 'Amiri',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/amiri/v25/J7a1npd8CGxZHp6rlWYA4Q.ttf', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/amiri/v25/J7a1npd8CGxZHp6rlWYA4Q.ttf', fontWeight: 'bold' } // Fallback same URL to avoid PDF crash on bold
    ]
});

const LOGO_URL = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : "/logo.png";

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
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 15,
        objectFit: 'contain',
    },
    brandTextContainer: {
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
        lineHeight: 1.4,
    },
    dayImage: {
        width: '100%',
        height: 120,
        objectFit: 'cover',
        borderRadius: 6,
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
        marginBottom: 6, // Increased spacing for better UI
        lineHeight: 1.5,
    },
});

export function ItineraryDocument({ data, language = 'en' }: { data: ItineraryData; language?: 'en' | 'ar' }) {
    const isAr = language === 'ar';
    const arFont = { fontFamily: isAr ? 'Amiri' : 'Helvetica', textAlign: isAr ? 'right' as const : 'left' as const };
    const arFontCenter = { fontFamily: isAr ? 'Amiri' : 'Helvetica', textAlign: 'center' as const };

    const t = (en: string, ar: string) => isAr ? ar : en;

    const tMeals = (meals: string) => {
        if (!isAr || !meals) return meals;
        return meals
            .replace(/Breakfast/gi, 'الإفطار')
            .replace(/Lunch/gi, 'الغداء')
            .replace(/Dinner/gi, 'العشاء')
            .replace(/Room Only/gi, 'غرفة فقط')
            .replace(/ & /g, ' و')
            .replace(/, /g, '، ');
    };

    const tStay = (stay: string) => {
        if (!isAr || !stay) return stay;
        return stay
            .replace(/Houseboat/gi, 'منزل عائم')
            .replace(/Hotel/gi, 'فندق')
            .replace(/Resort/gi, 'منتجع')
            .replace(/Camp/gi, 'مخيم')
            .replace(/Premium/gi, 'متميز')
            .replace(/Luxury/gi, 'فاخر')
            .replace(/Deluxe/gi, 'ديلوكس')
            .replace(/Standard/gi, 'قياسي')
            .replace(/Srinagar/gi, 'سريناجار')
            .replace(/Gulmarg/gi, 'جولمارج')
            .replace(/Pahalgam/gi, 'باهالجام')
            .replace(/Sonmarg/gi, 'سونمارج');
    };

    // Formatting helper
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) { return dateStr }
    };

    const formatDateRange = (start: string, end?: string) => {
        if (!start) return 'TBD';
        try {
            const s = new Date(start);
            if (!end) return formatDate(start);

            const e = new Date(end);
            if (s.getFullYear() === e.getFullYear()) {
                const startStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const endStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return `${startStr} - ${endStr}`;
            }
            return `${formatDate(start)} - ${formatDate(end)}`;
        } catch (e) { return start; }
    };

    return (
        <Document>
            <Page size="A4" style={{ ...styles.page, paddingBottom: 50 }}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {/* Logo */}
                        <Image src={LOGO_URL} style={styles.logo} />
                        <View style={styles.brandTextContainer}>
                            <Text style={{ ...styles.brandTitle, fontFamily: isAr ? 'Amiri' : 'Helvetica' }}>HIMALAYAN DAYS</Text>
                            <Text style={{ ...styles.brandSubtitle, ...arFont }}>{t('KASHMIR TOUR & TRAVEL EXPERTS', 'خبراء السياحة والسفر في كشمير')}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.contactText}>+91-9103901803</Text>
                        <Text style={styles.contactText}>thisishimalayandays@gmail.com</Text>
                        <Text style={styles.contactText}>www.himalayandays.in</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={[styles.titleSection, { textAlign: isAr ? 'right' : 'left' }]}>
                    <Text style={[styles.subTitle, arFont]}>{t('EXCLUSIVE ITINERARY FOR', 'مسار الرحلة الحصري لـ')}</Text>
                    <Text style={[styles.mainTitle, arFont]}>{data.clientName || t("Valued Guest", "ضيفنا الكريم")}</Text>
                </View>

                {/* Client Grid */}
                <View style={[styles.clientGrid, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                    <View style={styles.clientCol}>
                        <Text style={[styles.label, arFont]}>{t('Package Name', 'اسم الباقة')}</Text>
                        <Text style={[styles.value, arFont]}>{data.pkgTitle || t("Kashmir Tour Package", "باقة كشمير السياحية")}</Text>

                        <Text style={[styles.label, arFont]}>{t('Travel Dates', 'تواريخ السفر')}</Text>
                        <Text style={[styles.value, arFont]}>
                            {formatDateRange(data.travelDate, data.endDate)}
                        </Text>
                    </View>
                    <View style={styles.clientCol}>
                        <Text style={[styles.label, arFont]}>{t('Duration', 'المدة')}</Text>
                        <Text style={[styles.value, arFont]}>{data.duration || "-"}</Text>

                        <Text style={[styles.label, arFont]}>{t('Adults / Kids', 'البالغون / الأطفال')}</Text>
                        <Text style={[styles.value, arFont]}>{data.adults || 0} {t('Adults', 'بالغين')}, {data.kids || 0} {t('Kids', 'أطفال')}</Text>
                    </View>
                    <View style={{ ...styles.clientCol, borderRightWidth: 0 }}>
                        <Text style={[styles.label, arFont]}>{t('Quote Reference', 'الرقم المرجعي')}</Text>
                        <Text style={[styles.value, arFont]}>{data.quoteId}</Text>

                        <Text style={[styles.label, arFont]}>{t('Vehicle / Rooms', 'المركبة / الغرف')}</Text>
                        <Text style={[styles.value, arFont]}>
                            {data.vehicleType || t("Private Cab", "سيارة خاصة")}
                            {data.rooms ? ` • ${data.rooms}` : ""}
                        </Text>
                    </View>
                </View>

                {/* Timeline Itinerary */}
                <View>
                    <Text style={[styles.sectionHeader, arFont]}>{t('Journey Roadmap', 'خريطة الرحلة')}</Text>

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
                                <View style={[styles.dayContent, { textAlign: isAr ? 'right' : 'left' }]}>
                                    <Text style={[styles.dayTitle, arFont]}>{day.title}</Text>

                                    {/* Day Image */}
                                    {day.image && (
                                        <Image
                                            src={
                                                day.image.startsWith('data:')
                                                    ? day.image
                                                    : (typeof window !== 'undefined' ? `${window.location.origin}${day.image}` : day.image)
                                            }
                                            style={styles.dayImage}
                                        />
                                    )}

                                    <Text style={[styles.dayDesc, arFont]}>{day.description}</Text>

                                    {/* Meta Tags */}
                                    {(day.meals || day.stay) && (
                                        <View style={[styles.metaContainer, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                                            {day.stay && (
                                                <View style={[styles.metaItem, { marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }]}>
                                                    <Text style={[styles.metaText, arFont]}>{t('Stay:', 'الإقامة:')} {tStay(day.stay)}</Text>
                                                </View>
                                            )}
                                            {day.meals && (
                                                <View style={[styles.metaItem, { marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }]}>
                                                    <Text style={[styles.metaText, arFont]}>{t('Meals:', 'الوجبات:')} {tMeals(day.meals)}</Text>
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
                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 0 }}>
                        <View style={{ flex: 1, borderRightWidth: isAr ? 0 : 1, borderLeftWidth: isAr ? 1 : 0, borderColor: '#374151' }}>
                            <Text style={[{ color: COLORS.accent, fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }, arFontCenter]}>{t('Inclusions', 'المشمولات')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[{ color: '#9ca3af', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }, arFontCenter]}>{t('Exclusions', 'المستثنيات')}</Text>
                        </View>
                    </View>

                    {/* Table Body */}
                    {[
                        { inc: t('Hotel / Houseboat', 'فندق / منزل عائم'), exc: t('Airfare', 'تذاكر الطيران') },
                        { inc: t('Breakfast & Dinner', 'الإفطار والعشاء'), exc: t('Lunch', 'الغداء') },
                        { inc: t('Shikara Ride', 'جولة قارب شيكارا'), exc: t('Pony Ride', 'ركوب الخيل') },
                        { inc: t('All transfers and Srinagar Sightseeing', 'جميع التنقلات وجولات سريناجار'), exc: t('Gandola Ride', 'ركوب الجندول') },
                        { inc: t('Local Shopping Assistance', 'مساعدة في التسوق المحلي'), exc: t('Entrance Tickets & Activities', 'تذاكر الدخول والأنشطة') },
                    ].map((row, idx) => (
                        <View key={idx} style={{ flexDirection: isAr ? 'row-reverse' : 'row', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                            <View style={{ flex: 1, padding: 8, borderRightWidth: isAr ? 0 : 1, borderLeftWidth: isAr ? 1 : 0, borderColor: '#f3f4f6' }}>
                                <Text style={[{ fontSize: 9, color: COLORS.secondary }, arFontCenter]}>{row.inc}</Text>
                            </View>
                            <View style={{ flex: 1, padding: 8 }}>
                                <Text style={[{ fontSize: 9, color: '#9ca3af' }, arFontCenter]}>{row.exc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Terms & Conditions */}
                <View style={[styles.termsContainer, { textAlign: isAr ? 'right' : 'left' }]} wrap={false}>
                    <Text style={[styles.termsHeader, arFont]}>{t('Terms & Conditions', 'الشروط والأحكام')}</Text>
                    {[
                        t("From your first enquiry until the completion of your tour, our travel advisors will be available to assist you 24×7.", "مستشارو السفر لدينا متاحون لمساعدتك على مدار الساعة"),
                        t("To confirm your booking, an advance payment of 30% of the total tour cost is required. The remaining 70% balance must be paid upon arrival.", "لتأكيد الحجز، يلزم دفع مقدم 30%. الباقي 70% يدفع عند الوصول."),
                        t("All bookings are considered confirmed only after the advance payment is successfully received.", "تعتبر الحجوزات مؤكدة فقط بعد استلام الدفعة المقدمة."),
                        t("If you decide to cancel your booking after confirmation, Himalayan Days does not charge any tour cancellation fee. However, any hotel and driver cancellation charges will be borne by the guest.", "لا نفرض رسوم إلغاء، لكن يتحمل الضيف رسوم إلغاء الفندق والسائق إن وجدت."),
                        t("Guests are requested to make the advance payment soon after finalising the itinerary to ensure availability.", "يرجى الدفع المبكر لضمان توافر الفنادق والنقل."),
                        t("Prepaid SIM cards generally do not function properly in Kashmir & Ladakh.", "شرائح الهاتف مسبقة الدفع قد لا تعمل بشكل جيد في كشمير، يرجى استخدام شرائح الفاتورة."),
                        t("All personal expenses, entry fees, pony rides, gondola tickets and any optional activities not specifically mentioned in the itinerary are not included in the tour cost.", "المصروفات الشخصية والأنشطة الاختيارية غير مشمولة في التكلفة."),
                        t("Check-in and check-out timings at hotels are strictly subject to the respective hotel’s policies.", "أوقات تسجيل الدخول والخروج تخضع لسياسات الفنادق.")
                    ].map((term, idx) => (
                        <Text key={idx} style={[styles.termItem, arFont]}>• {term}</Text>
                    ))}
                </View>

                {/* Cost Section */}
                <View style={[styles.priceSection, { flexDirection: isAr ? 'row-reverse' : 'row' }]} wrap={false}>
                    <View style={styles.priceLeft}>
                        <Text style={[styles.priceLabel, arFont]}>{t('TOTAL TOUR COST', 'التكلفة الإجمالية للرحلة')}</Text>
                        <Text style={[styles.priceSub, arFont]}>{t('*Valid for 7 days. Includes all taxes.', '*صالح لمدة 7 أيام. شامل جميع الضرائب.')}</Text>
                    </View>
                    <Text style={[styles.priceValue, arFont]}>{isAr ? '₹' : 'Rs.'} {data.totalCost || "0"}{t('/-', '')}</Text>
                </View>

                {/* Payment Section */}
                {data.upiId && (
                    <View style={{ marginTop: 20, padding: 15, borderTopWidth: 1, borderTopColor: '#e5e7eb', flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }} wrap={false}>
                        <View style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
                            <Text style={[arFont, { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 }]}>{t('SCAN TO PAY', 'امسح للدفع')}</Text>
                            <Text style={[arFont, { fontSize: 8, color: COLORS.secondary, marginBottom: 8 }]}>{t('Use any UPI app to make the secure payment.', 'استخدم أي تطبيق UPI لإجراء الدفع الآمن.')}</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.accent }}>{data.upiId}</Text>
                        </View>
                        {/* Dynamic QR Code */}
                        <Image
                            src={`https://quickchart.io/qr?text=${encodeURIComponent(`upi://pay?pa=${data.upiId}&pn=Himalayan Days`)}&size=150`}
                            style={{ width: 80, height: 80 }}
                        />
                    </View>
                )}

                {/* Footer with properly nested pagination */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>© 2026 Himalayan Days. All rights reserved.</Text>
                </View>

            </Page>
        </Document>
    );
};
