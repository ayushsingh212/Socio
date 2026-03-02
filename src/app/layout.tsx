// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { CallProvider, } from "@/context/CallContext";
import {SocketProvider} from "@/context/SocketContext"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Viewport config moved to its own export (Next.js 13.4+ requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  // ✅ Required for resolving relative OG/Twitter image URLs
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Socioo - Connect with the world",
    template: "%s | Socioo",
  },
  description:
    "A modern social media platform to share your moments, connect with friends, and discover new content",
  keywords: [
    "social media",
    "connect",
    "share",
    "moments",
    "friends",
    "video calls",
    "voice calls",
  ],
  authors: [{ name: "Socioo Team" }],
  creator: "Socioo",
  publisher: "Socioo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Socioo",
    description: "Connect with friends and the world around you",
    url: "https://socioo.com",
    siteName: "Socioo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Socioo - Connect with the world",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Socioo",
    description: "Connect with friends and the world around you",
    images: ["/og-image.png"],
    creator: "@socioo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // ✅ apple-mobile-web-app moved here from manual <head> tags
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
          <CallProvider>
            {children}

            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                // ✅ Use a large finite number instead of Infinity to satisfy TypeScript
                duration: 4000,
                style: {
                  background: "#1f2937",
                  color: "#fff",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                  style: {
                    border: "1px solid #10b981",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                  style: {
                    border: "1px solid #ef4444",
                  },
                },
                loading: {
               
                  duration: 1_000_000,
                  style: {
                    border: "1px solid #fbbf24",
                  },
                },
              }}
            />
          </CallProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}