import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ReCaptchaWrapper } from "@/components/providers/recaptcha-provider";
import { DynamicThemeProvider } from "@/components/providers/dynamic-theme-provider";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Himalayan Days | Best Kashmir Tour Packages",
    template: "%s | Himalayan Days"
  },
  metadataBase: new URL('https://himalayandays.in'),
  description: "Book your dream Kashmir vacation with Himalayan Days. Best tour packages, hotels, and houseboats. Recognized by J&K Tourism.",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://himalayandays.in',
    title: 'Himalayan Days | Best Kashmir Tour Packages',
    description: 'Premier travel agency in Kashmir offering curated tour packages, luxury houseboats, and adventure trips.',
    siteName: 'Himalayan Days',
    images: [
      {
        url: '/Destinations/Gulmarg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Himalayan Days - Experience Heaven on Earth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Days | Best Kashmir Tour Packages',
    description: 'Plan your perfect Kashmir trip with Himalayan Days. Trusted local experts.',
    creator: '@himalayandays',
    images: ['/Destinations/Gulmarg.jpeg'],
  },
  icons: {
    icon: '/logo.png',
  },
  verification: {
    google: 'C9b0QmnsuBqPEFcDsZvPCCX_6zGN9pUoyBvI4FkPvtM',
    other: {
      'facebook-domain-verification': 'fv2u1efd4ofdhvxstxqsbbml5quyek',
    },
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
          <DynamicThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <WhatsAppButton />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <FacebookPixel />
            {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
          </DynamicThemeProvider>
        </ReCaptchaWrapper>
      </body>
    </html>
  );
}
