import Link from "next/link"
import { ArrowRight, Briefcase, MapPin, Sparkles, Ban, PauseCircle } from "lucide-react"
import { getJobStatus } from "@/lib/careers-db"

export const metadata = {
    title: "Careers at Himalayan Days",
    description: "Join the fastest growing travel agency in Kashmir. View open positions.",
}

export default async function CareersIndexPage() {
    const salesStatus = await getJobStatus('sales-executive')

    const jobs = [
        {
            title: "Sales Executive",
            type: "Full Time • Hybrid",
            location: "Srinagar, J&K",
            department: "Sales Team",
            link: "/careers/sales-executive",
            status: salesStatus
        }
    ]

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl -z-10" />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="w-4 h-4" />
                    We Are Hiring
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    Shape the Future of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">Travel in Kashmir</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Join a team of passionate individuals dedicated to crafting unforgettable experiences.
                </p>
            </section>

            {/* Jobs List */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Positions</h2>

                <div className="grid gap-4">
                    {jobs.map((job) => {
                        const isClosed = job.status === 'CLOSED'
                        const isOnHold = job.status === 'ON_HOLD'
                        const isOpen = !isClosed && !isOnHold

                        return (
                            <Link
                                key={job.title}
                                href={job.link}
                                className={`group bg-white rounded-2xl p-6 border shadow-sm transition-all flex items-center justify-between ${isOpen
                                    ? 'border-gray-100 hover:shadow-md hover:border-brand-primary/30'
                                    : 'border-gray-100 opacity-90'
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        {isClosed && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
                                                Positions Filled
                                            </span>
                                        )}
                                        {isOnHold && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                                                Position On Hold
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            {job.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </span>
                                    </div>
                                </div>
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isClosed
                                    ? 'bg-gray-100 text-gray-400'
                                    : isOnHold
                                        ? 'bg-yellow-50 text-yellow-600'
                                        : 'bg-gray-50 group-hover:bg-brand-primary group-hover:text-white'
                                    }`}>
                                    {isClosed && <Ban className="w-5 h-5" />}
                                    {isOnHold && <PauseCircle className="w-5 h-5" />}
                                    {isOpen && <ArrowRight className="w-5 h-5" />}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Don't see a role for you?</h3>
                    <p className="text-blue-700 mb-4">
                        We are always looking for talented driver partners, hoteliers, and content creators.
                    </p>
                    <a href="mailto:thisishimalayandays@gmail.com" className="text-brand-primary font-semibold hover:underline">
                        Email us at thisishimalayandays@gmail.com
                    </a>
                </div>

            </div>
        </main>
    )
}
