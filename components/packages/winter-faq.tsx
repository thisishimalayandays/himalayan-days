
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Sparkles } from 'lucide-react';

export function WinterFAQ() {
    return (
        <section className="bg-sky-50 rounded-2xl p-6 md:p-8 mt-12 border border-sky-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-sky-500 fill-sky-200" /> Winter Survival Guide
            </h2>

            <Accordion type="single" collapsible className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it safe for kids and elderly?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Yes, absolutely. We use only **centrally heated hotels** and vehicles. The cold is enjoyable when you are warm inside. We also have a 24/7 support team to assist with any needs.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>What kind of clothes should I pack?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        We recommend layers: Thermals (inner layer) + Sweater (middle) + Heavy Jacket (outer). Also pack woolen socks, gloves, and a cap. Snow boots can be rented in Gulmarg.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Are the roads open during snow?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Our cabs (Innova/Scorpio) are equipped with **Snow Chains** to drive safely on snowy roads. In extreme cases, authorities clear roads within a few hours.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>How does the Houseboat heating work?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Our luxury houseboats use traditional wood-fired stoves or electric heating (depending on category) to keep the rooms cozy. Bed warmers (electric blankets) are also provided.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    )
}
