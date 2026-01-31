'use client'

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitApplication } from "@/app/actions/careers"
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const initialState = {
    success: false,
    message: "",
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-lg text-white",
                pending
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
            )}
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Application...
                </>
            ) : (
                "Submit Application"
            )}
        </button>
    )
}

export function ApplicationForm({ jobSlug = "general" }: { jobSlug?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, formAction] = useActionState(submitApplication, initialState)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name)
        }
    }

    if (state.success) {
        return (
            <div className="w-full bg-white/50 backdrop-blur-md border border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h3>
                <p className="text-gray-600 mb-6">
                    {state.message}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-brand-primary hover:underline"
                >
                    Send another application
                </button>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-6 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/50">
            <input type="hidden" name="jobSlug" value={jobSlug} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="e.g. Sana Khan"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g. sana@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Resume / CV (PDF or Doc)</label>
                <div className="relative">
                    <input
                        type="file"
                        name="resume"
                        id="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={cn(
                        "w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all",
                        fileName ? "border-brand-primary bg-brand-primary/5" : "border-gray-200 hover:border-brand-primary/50 hover:bg-gray-50"
                    )}>
                        {fileName ? (
                            <>
                                <CheckCircle className="w-8 h-8 text-brand-primary mb-2" />
                                <p className="font-medium text-gray-900">{fileName}</p>
                                <p className="text-xs text-green-600 mt-1">Ready to upload</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="font-medium text-gray-600">Click to upload resume</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="coverLetter" className="text-sm font-medium text-gray-700">Cover Letter (Optional)</label>
                <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    placeholder="Tell us why you are a great fit for Himalayan Days..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                />
            </div>

            {state.message && !state.success && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {state.message}
                </div>
            )}

            {/* Honeypot Field for Bots */}
            <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

            <SubmitButton />
        </form>
    )
}
