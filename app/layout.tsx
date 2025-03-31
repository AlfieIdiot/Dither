import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Use Poppins for headings
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Use Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Dither - Modern Image Dithering Tool",
  description: "A powerful web-based image dithering tool with multiple algorithms and customizable settings",
  keywords: ["dither", "image processing", "dithering", "pixel art", "retro graphics"],
  authors: [{ name: "Dither Team" }],
  creator: "Dither Team",
  publisher: "Dither",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dither.vercel.app",
    title: "Dither - Modern Image Dithering Tool",
    description: "A powerful web-based image dithering tool with multiple algorithms and customizable settings",
    siteName: "Dither",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Dither - Modern Image Dithering Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dither - Modern Image Dithering Tool",
    description: "A powerful web-based image dithering tool with multiple algorithms and customizable settings",
    images: ["/og-image.png"],
    creator: "@dither",
  },
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    shortcut: { url: "/favicon.ico" },
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2b2b2b" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'