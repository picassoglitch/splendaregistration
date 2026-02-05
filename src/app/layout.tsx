import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SWRegister } from "@/components/pwa/SWRegister";
import { ConfigHydrate } from "@/components/content/ConfigHydrate";

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
    default: "Swat & Smart 2026",
    template: "%s · Swat & Smart 2026",
  },
  description: "Event companion app para Swat & Smart 2026.",
  applicationName: "Swat & Smart 2026",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Swat & Smart 2026",
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
        <div className="min-h-dvh bg-background text-foreground md:flex md:items-center md:justify-center md:p-8">
          <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-background md:min-h-[calc(100dvh-64px)] md:rounded-[36px] md:shadow-2xl md:ring-1 md:ring-black/10 overflow-hidden">
            {children}
          </div>
        </div>
        <SWRegister />
        <ConfigHydrate />
      </body>
    </html>
  );
}
