import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import AmbientBackground from "@/components/ambient-background";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: "swap"
});

// Assuming we don't have Fragment Mono locally yet, we'll use a fallback monospace for display
// You can replace this later by adding next/font/google config for Fragment Mono 
// when it's available or by adding the local font file.
// For now, mapping it to JetBrains Mono to prevent errors, but you can adjust.
const fragmentMono = {
  className: jetbrainsMono.className,
  style: { fontFamily: 'var(--font-jetbrains-mono)' },
  variable: '--font-fragment-mono'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://anush.tech'),
  title: "Anush Gupta — Buildverse City",
  description: "Explore Anush Gupta’s 3D portfolio city: project buildings, engineering floors, product decisions, and experience at Park+.",
  alternates: {
    canonical: 'https://anush.tech',
  },
  openGraph: {
    title: "Anush Gupta — Buildverse City",
    description: "Explore Anush Gupta’s 3D portfolio city: project buildings, engineering floors, product decisions, and experience at Park+.",
    url: "https://anush.tech",
    siteName: "Anush Gupta Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Anush Gupta — Buildverse City",
    description: "Explore Anush Gupta’s 3D portfolio city: project buildings, engineering floors, product decisions, and experience at Park+.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${fragmentMono.variable} antialiased text-text-primary bg-bg-base overflow-x-hidden transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <AmbientBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
