/*
 * VISUAL REGRESSION CHECKLIST (global):
 * - Mobile 390px, 428px: no horizontal scroll, content fits
 * - Desktop 1024px: phone frame max-w-[430px] centered, no crop
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SWRegister } from "@/components/pwa/SWRegister";
import { ConfigHydrate } from "@/components/content/ConfigHydrate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConnectionStatus } from "@/components/ConnectionStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sweet & Smart 2026",
    template: "%s · Sweet & Smart 2026",
  },
  description: "Event companion app para Sweet & Smart 2026.",
  applicationName: "Sweet & Smart 2026",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
    shortcut: [{ url: "/icon", type: "image/png" }],
  },
  openGraph: {
    title: "Sweet & Smart 2026",
    description: "Event companion app para Sweet & Smart 2026.",
    siteName: "Sweet & Smart 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet & Smart 2026",
    description: "Event companion app para Sweet & Smart 2026.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sweet & Smart 2026",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#213b74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-full min-h-dvh flex justify-center items-start bg-[#1C3D78] md:py-8 md:px-6 lg:py-12">
          <div className="w-full min-h-dvh bg-background text-foreground md:max-w-[430px] md:rounded-[24px] md:shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-x-hidden md:max-h-[calc(100dvh-64px)] md:overflow-y-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </div>
        <ConnectionStatus />
        <SWRegister />
        <ConfigHydrate />
      </body>
    </html>
  );
}
