
import { ShieldCheck, ThermometerSun, Clock, CreditCard } from 'lucide-react';

export function TrustBadges() {
    return (
        <section className="bg-orange-50 border-y border-orange-100 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-2">
                        <ThermometerSun className="w-8 h-8 text-orange-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Centrally Heated</h4>
                            <p className="text-xs text-gray-500">Stays & Vehicles</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2">
                        <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Verified Safe</h4>
                            <p className="text-xs text-gray-500">For Families & Kids</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2">
                        <Clock className="w-8 h-8 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">24/7 Support</h4>
                            <p className="text-xs text-gray-500">On-Ground Team</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2">
                        <CreditCard className="w-8 h-8 text-purple-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Easy Booking</h4>
                            <p className="text-xs text-gray-500">Pay 25% to Book</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
