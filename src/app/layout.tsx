import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nonaxial.com"),
  title: {
    default: "nonaxial - 200+ Animated React Components",
    template: "%s | nonaxial",
  },
  description: "A collection of 200+ smooth, high-quality animated React components. Copy and paste directly into your project. Built with Tailwind CSS and Framer Motion.",
  keywords: [
    "react components",
    "animated components",
    "tailwind css",
    "framer motion",
    "ui library",
    "shadcn",
    "next.js components",
    "hover effects",
    "glassmorphism",
    "magnetic button",
    "cursor effects",
    "text animations",
    "loading animations",
    "card animations",
    "open source",
    "copy paste components",
  ],
  authors: [{ name: "Anukar", url: "https://github.com/AnukarOP" }],
  creator: "Anukar",
  publisher: "nonaxial",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nonaxial.com",
    siteName: "nonaxial",
    title: "nonaxial - 200+ Animated React Components",
    description: "Smooth, high-quality animated React components. Copy. Paste. Ship.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "nonaxial - Animated React Components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nonaxial - 200+ Animated React Components",
    description: "Smooth, high-quality animated React components. Copy. Paste. Ship.",
    creator: "@anukarop",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://nonaxial.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('nonaxial-theme');
                if (theme) {
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(theme);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "nonaxial",
              description:
                "A modern, open-source React component library with 200+ animated UI components built with Tailwind CSS and Framer Motion.",
              url: "https://nonaxial.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://nonaxial.com/components?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              creator: {
                "@type": "Person",
                name: "Anukar",
              },
              publisher: {
                "@type": "Organization",
                name: "nonaxial",
                logo: {
                  "@type": "ImageObject",
                  url: "https://nonaxial.com/icon-512.png",
                },
              },
              inLanguage: "en-US",
              isAccessibleForFree: true,
              license: "https://opensource.org/licenses/MIT",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareSourceCode",
              name: "nonaxial",
              description:
                "Open-source React component library with animated UI components",
              codeRepository: "https://github.com/AnukarOP/nonaxial",
              programmingLanguage: ["TypeScript", "React", "JavaScript"],
              runtimePlatform: "Node.js",
              targetProduct: {
                "@type": "SoftwareApplication",
                name: "nonaxial",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Cross-platform",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-14">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
