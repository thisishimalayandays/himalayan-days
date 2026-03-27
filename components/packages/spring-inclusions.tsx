'use client';

import { Check, X, Shield, Award, Clock, Headphones } from 'lucide-react';

interface Props {
    inclusions: string[];
    exclusions: string[];
}

const trustItems = [
    { icon: Shield, label: 'Safe & Secure', sub: 'No online payment required' },
    { icon: Award, label: 'Best Price', sub: 'Guaranteed match' },
    { icon: Clock, label: '24/7 Support', sub: 'On-trip assistance' },
    { icon: Headphones, label: 'Expert Planners', sub: '10+ years experience' },
];

export function SpringInclusionsExclusions({ inclusions, exclusions }: Props) {
    return (
        <div className="space-y-8">
            {/* Trust strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trustItems.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                            <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" />
                        </span>
                        What&#39;s Included
                    </h3>
                    <ul className="space-y-3">
                        {inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-green-600" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-red-400 flex items-center justify-center shrink-0">
                            <X className="w-4 h-4 text-white" />
                        </span>
                        Not Included
                    </h3>
                    <ul className="space-y-3">
                        {exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                                <span className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                                    <X className="w-3 h-3 text-red-500" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
