'use client'

import { useEffect, useRef } from "react"
import { checkNewInquiries } from "@/app/actions/notifications"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function NotificationWatcher() {
    const { toast } = useToast()
    const router = useRouter()

    // Store last check time. Initial value is mount time.
    const lastCheckTime = useRef<number>(Date.now())

    // Notification Sound URL
    // Using a reliable notification sound (Bell)
    const soundUrl = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const currentCheckTime = lastCheckTime.current

                // Call server action
                const result = await checkNewInquiries(currentCheckTime)

                if (result.hasNew) {
                    // 1. Play Sound
                    const audio = new Audio(soundUrl)
                    audio.play().catch(e => console.log("Audio play failed (interaction required):", e))

                    // 2. Show Toast
                    toast({
                        title: "New Inquiry Recieved! 🎉",
                        description: `You have ${result.count} new inquiry waiting.`,
                        duration: 5000,
                        className: "bg-green-500 text-white border-none",
                    })

                    // 3. Update Timestamp
                    lastCheckTime.current = result.timestamp

                    // 4. Refresh Page Data (Badges)
                    router.refresh()
                }

            } catch (error) {
                console.error("Polling error:", error)
            }
        }, 30000) // Poll every 30 seconds

        return () => clearInterval(intervalId)
    }, [toast, router])

    return null // Invisible component
}
