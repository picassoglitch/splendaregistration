/*
 * VISUAL REGRESSION CHECKLIST (global):
 * - Mobile 375px, 390px, 428px: no horizontal scroll, content fits
 * - Tablet 768px: multi-column where applicable, content centered
 * - Desktop 1024px+: max-w-5xl content area, proper spacing
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
  description: "Your favorite companion app for any event.",
  applicationName: "Sweet & Smart 2026",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico", type: "image/png" }],
  },
  openGraph: {
    title: "Sweet & Smart 2026",
    description: "Your favorite companion app for any event.",
    siteName: "Sweet & Smart 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet & Smart 2026",
    description: "Your favorite companion app for any event.",
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
        <div className="w-full min-h-dvh bg-background text-foreground overflow-x-hidden">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        <ConnectionStatus />
        <SWRegister />
        <ConfigHydrate />
      </body>
    </html>
  );
}
