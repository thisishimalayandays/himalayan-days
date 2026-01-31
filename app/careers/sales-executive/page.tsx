import { ApplicationForm } from "@/components/careers/application-form"
import { Briefcase, Building, Clock, MapPin, Users, ChevronLeft, Ban, CheckCircle, PauseCircle, FileText, Search, Video, Trophy, Sparkles, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getJobStatus } from "@/lib/careers-db"

export const metadata = {
    title: "Sales Executive | Himalayan Days Careers",
    description: "Apply for the Sales Executive position at Himalayan Days. Hybrid work model in Srinagar.",
}

export default async function SalesExecutivePage() {
    const status = await getJobStatus('sales-executive')
    const isClosed = status === 'CLOSED'
    const isOnHold = status === 'ON_HOLD'

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
            {/* Header / Nav Back */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/careers" className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors font-medium">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Openings
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="pt-12 pb-12 px-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    {isClosed && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                            <Ban className="w-3 h-3" /> Positions Filled
                        </span>
                    )}
                    {isOnHold && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider">
                            <PauseCircle className="w-3 h-3" /> Position On Hold
                        </span>
                    )}
                    {!isClosed && !isOnHold && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3" /> Actively Hiring
                        </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Sales Executive
                </h1>
                <p className="text-xl text-gray-600 font-medium">Himalayan Days • Sales Team</p>
            </section>

            {/* Content Grid */}
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">

                {/* Left Column: Job Description */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                                <p className="text-brand-primary font-medium mt-1">Full Time • Hybrid</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Location</p>
                                    <p className="text-sm font-semibold text-gray-900">Srinagar, J&K</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <Building className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Work Mode</p>
                                    <p className="text-sm font-semibold text-gray-900">Hybrid (WFO + WFH)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <Users className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Preference</p>
                                    <p className="text-sm font-semibold text-gray-900">Female Preferred</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Start Date</p>
                                    <p className="text-sm font-semibold text-gray-900">Immediate</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* About */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">About the Role</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    We are looking for a smart, improving Sales Executive to handle our inbound leads. You will be the voice of 'Himalayan Days', helping customers plan their dream Kashmir vacation. This role requires empathy, patience, and strong communication skills.
                                </p>
                            </section>

                            <div className="h-px bg-gray-100" />

                            {/* Responsibilities */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Key Responsibilities</h3>
                                </div>
                                <ul className="grid gap-3">
                                    <li className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <span className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 text-sm font-bold">1</span>
                                        <span className="text-gray-700">Handling inbound WhatsApp inquiries and closing sales (High conversion required).</span>
                                    </li>
                                    <li className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <span className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 text-sm font-bold">2</span>
                                        <div>
                                            <strong className="text-gray-900">Vendor Management:</strong>
                                            <span className="text-gray-700 block mt-1">Calling hotels and houseboats to negotiate rates and confirm availability.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <span className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 text-sm font-bold">3</span>
                                        <span className="text-gray-700">Coordinating with cab drivers to ensure smooth pickups/drops for guests.</span>
                                    </li>
                                    <li className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <span className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 text-sm font-bold">4</span>
                                        <span className="text-gray-700">Creating custom itineraries and costing quotes quickly.</span>
                                    </li>
                                </ul>
                            </section>

                            <div className="h-px bg-gray-100" />

                            {/* Requirements */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                                </div>

                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800 font-medium">
                                        Note: We are currently ONLY hiring experienced candidates. Freshers please do not apply.
                                    </p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span><strong>Minimum 1 Year Experience</strong> working in a Kashmir-based Travel Agency.</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Must know the pricing of major hotels in Gulmarg, Pahalgam, and Srinagar.</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Excellent negotiation skills with hoteliers and drivers.</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Fluent in Hindi/Urdu and professional English.</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span><strong>Must have own Laptop</strong> (Required for work).</span>
                                    </li>
                                </ul>
                            </section>

                            {/* Flexible Work Culture Box */}
                            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl shadow-sm mt-8">
                                <div className="flex gap-3">
                                    <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-orange-900 font-bold mb-1">Flexible Work Culture</h4>
                                        <p className="text-sm text-orange-800 leading-relaxed">
                                            We start with an in-office week to help you get settled. After that, we are happy to offer <strong>Work from Home</strong> days (3-4 per week) to team members who demonstrate consistent performance and ownership. We love to reward results with flexibility!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hiring Process Timeline */}
                            <div className="pt-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Hiring Process</h3>
                                <div className="space-y-0">
                                    {/* Step 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm z-10 relative">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="w-0.5 h-full bg-blue-100 -mt-2 -mb-2" />
                                        </div>
                                        <div className="pb-8 pt-2">
                                            <h4 className="font-semibold text-gray-900">1. Apply Online</h4>
                                            <p className="text-sm text-gray-500 mt-1">Submit your application using the form.</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm z-10 relative">
                                                <Search className="w-5 h-5" />
                                            </div>
                                            <div className="w-0.5 h-full bg-blue-100 -mt-2 -mb-2" />
                                        </div>
                                        <div className="pb-8 pt-2">
                                            <h4 className="font-semibold text-gray-900">2. Profile Review</h4>
                                            <p className="text-sm text-gray-500 mt-1">Our team reviews your experience and skills.</p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm z-10 relative">
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div className="w-0.5 h-full bg-blue-100 -mt-2 -mb-2" />
                                        </div>
                                        <div className="pb-8 pt-2">
                                            <h4 className="font-semibold text-gray-900">3. Interview</h4>
                                            <p className="text-sm text-gray-500 mt-1">A discussion via Zoom or in-person meeting.</p>
                                        </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center border border-green-200 shadow-sm z-10 relative">
                                                <Trophy className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="pb-2 pt-2">
                                            <h4 className="font-semibold text-gray-900">4. Selection</h4>
                                            <p className="text-sm text-gray-500 mt-1">Contract offer & Onboarding.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Application Form */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24">
                        <div className="mb-4">
                            {isClosed && (
                                <h3 className="text-xl font-bold text-gray-400">Applications Closed</h3>
                            )}
                            {isOnHold && (
                                <h3 className="text-xl font-bold text-yellow-600">Position On Hold</h3>
                            )}
                            {!isClosed && !isOnHold && (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900">Apply Now</h3>
                                    <p className="text-sm text-gray-500">Fill out the form below to start your journey.</p>
                                </>
                            )}
                        </div>

                        {isClosed && (
                            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                    <Ban className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Positions Filled</h3>
                                    <p className="text-gray-500 mt-2">
                                        Thank you for your interest. We have received a high volume of applications and this position is currently closed.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Link href="/careers" className="text-brand-primary font-medium hover:underline">
                                        Check other openings
                                    </Link>
                                </div>
                            </div>
                        )}

                        {isOnHold && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600">
                                    <PauseCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Reviewing Applications</h3>
                                    <p className="text-yellow-800 mt-2">
                                        We have a received a good number of applications and have put this position on temporary hold while we review them.
                                    </p>
                                    <p className="text-sm text-gray-500 mt-4">
                                        Please check back later to see if new slots open up!
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isClosed && !isOnHold && (
                            <ApplicationForm jobSlug="sales-executive" />
                        )}
                    </div>
                </div>

            </div>
        </main>
    )
}
