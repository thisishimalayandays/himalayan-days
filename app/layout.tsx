import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ReCaptchaWrapper } from "@/components/providers/recaptcha-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Himalayan Days - Experience Kashmir",
    template: "%s | Himalayan Days"
  },
  metadataBase: new URL('https://himalayandays.in'),
  description: "Book your dream Kashmir vacation with Himalayan Days. Best tour packages, hotels, and houseboats. Recognized by J&K Tourism.",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://himalayandays.in',
    title: 'Himalayan Days - Experience Heaven on Earth',
    description: 'Premier travel agency in Kashmir offering curated tour packages, luxury houseboats, and adventure trips.',
    siteName: 'Himalayan Days',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Days - Kashmir Travel Experts',
    description: 'Plan your perfect Kashmir trip with Himalayan Days. Trusted local experts.',
    creator: '@himalayandays',
  },
  icons: {
    icon: '/Himalayan%20Days%20Logo.png',
  },
  verification: {
    google: 'C9b0QmnsuBqPEFcDsZvPCCX_6zGN9pUoyBvI4FkPvtM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <ReCaptchaWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <WhatsAppButton />
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </ReCaptchaWrapper>
      </body>
    </html>
  );
}
