
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Sparkles } from 'lucide-react';

export function WinterFAQ() {
    return (
        <section className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 mt-12 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-amber-500 fill-amber-100" /> Winter Travel Essentials
            </h2>

            <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-slate-100 px-4 space-y-2">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="hover:text-amber-600 transition-colors">Is it safe for kids and elderly?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg mt-2">
                        <p className="mb-2"><strong className="text-slate-800">Absolutely.</strong> Safety is our priority.</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>We use strictly <strong className="text-slate-700">centrally heated hotels</strong> to keep you warm.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>Our fleet (Innova/Scorpio) is <strong className="text-slate-700">fully heated</strong> and comfortable.</span>
                            </li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-500">The cold is an experience to enjoy, not endure. Our on-ground team is available 24/7 for any assistance.</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="hover:text-amber-600 transition-colors">What kind of clothes should I pack?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg mt-2">
                        <p className="mb-3 font-medium text-slate-700">Follow the "3-Layer Rule" for maximum warmth:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                            <div className="bg-white p-2 rounded border text-center text-sm">
                                <span className="block font-bold text-amber-600">1. Thermals</span>
                                <span className="text-xs text-gray-500">Inner Skin Layer</span>
                            </div>
                            <div className="bg-white p-2 rounded border text-center text-sm">
                                <span className="block font-bold text-amber-600">2. Sweater</span>
                                <span className="text-xs text-gray-500">Insulation Layer</span>
                            </div>
                            <div className="bg-white p-2 rounded border text-center text-sm">
                                <span className="block font-bold text-amber-600">3. Jacket</span>
                                <span className="text-xs text-gray-500">Windproof Shell</span>
                            </div>
                        </div>
                        <p className="font-semibold text-sm mb-1">Don't forget:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-1">
                            <li>Woolen Socks & Waterproof Gloves</li>
                            <li><strong>Sunglasses</strong> (Crucial for snow glare)</li>
                            <li>Moisturizer & Sunscreen</li>
                        </ul>
                        <p className="mt-3 text-xs text-slate-400 italic bg-white inline-block px-2 py-1 rounded border">
                            Tip: Heavy snow boots are available for rent in Gulmarg.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="hover:text-amber-600 transition-colors">Will my phone work in Kashmir?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg mt-2">
                        <div className="flex items-start gap-3 bg-red-50 border border-red-100 p-3 rounded-md">
                            <span className="text-red-500 font-bold text-lg">!</span>
                            <div>
                                <strong className="text-red-700 block mb-1">Prepaid SIMs do NOT work.</strong>
                                <p className="text-sm">Only <strong>Postpaid connections</strong> (Jio, Airtel, Vi) have roaming service in J&K. Please convert one SIM to postpaid before your flight, or buy a local SIM upon arrival.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b-0">
                    <AccordionTrigger className="hover:text-amber-600 transition-colors">Are the roads open during snow?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg mt-2">
                        <p className="mb-2">Yes. We are prepared for it.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <span className="bg-blue-100 text-blue-600 px-1.5 rounded text-xs font-bold py-0.5 h-fit mt-0.5">EXPERT</span>
                                <span>Our drivers are locals who drive on snow daily.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-blue-100 text-blue-600 px-1.5 rounded text-xs font-bold py-0.5 h-fit mt-0.5">Gear</span>
                                <span>All vehicles carry <strong>Snow Chains</strong> for traction.</span>
                            </li>
                        </ul>
                        <p className="mt-2 text-xs text-slate-500">
                            While heavy snow can cause temporary delays, authorities clear the main Srinagar-Gulmarg highway consistently.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-b-0">
                    <AccordionTrigger className="hover:text-amber-600 transition-colors">How does Houseboat heating work?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg mt-2">
                        <p className="mb-3">We ensure you stay cozy on the lake using two methods:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <li className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                <strong className="block text-slate-800 mb-1">Room Heating</strong>
                                <span className="text-sm">Traditional Bukhari (Wood stove) or Electric heaters depending on category.</span>
                            </li>
                            <li className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                <strong className="block text-slate-800 mb-1">Bed Heating</strong>
                                <span className="text-sm">Every bed is equipped with <strong>Electric Blankets</strong> for a warm sleep.</span>
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    )
}
