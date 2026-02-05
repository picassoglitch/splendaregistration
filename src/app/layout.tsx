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
        <div className="w-full min-h-dvh flex justify-center items-start bg-[#f3f4f6] md:py-8 md:px-6 lg:py-12">
          <div className="w-full min-h-dvh md:min-h-[calc(100dvh-64px)] bg-background text-foreground md:max-w-[430px] md:rounded-[24px] md:shadow-[0_10px_30px_rgba(0,0,0,0.12)] md:overflow-hidden">
            {children}
          </div>
        </div>
        <SWRegister />
        <ConfigHydrate />
      </body>
    </html>
  );
}
