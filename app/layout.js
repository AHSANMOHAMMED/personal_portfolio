import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import { SITE_URL } from '@/lib/siteConfig';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const description =
  'Software Engineer and MERN Stack specialist with a focus on enterprise applications, Spring Boot, Android, and AI-assisted solutions.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ahsan Mohammed | Software Engineer',
    template: '%s | Ahsan Mohammed',
  },
  description,
  keywords: [
    'Ahsan Mohammed',
    'Software Engineer',
    'MERN Stack',
    'Spring Boot',
    'Android Developer',
    'AI Integration',
    'Full Stack Developer',
    'Sri Lanka',
    'SLIIT',
  ],
  authors: [{ name: 'Ahsan Mohammed', url: SITE_URL }],
  creator: 'Ahsan Mohammed',
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: SITE_URL,
    siteName: 'Ahsan Mohammed',
    title: 'Ahsan Mohammed | Software Engineer',
    description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Ahsan Mohammed | Software Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahsan Mohammed | Software Engineer',
    description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
      { url: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicons/manifest.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ahsan Mohammed',
              url: SITE_URL,
              email: 'ahsanmohammed828@gmail.com',
              jobTitle: 'Software Engineer',
              description: 'Full-stack Software Engineer specializing in React, Next.js, Flutter, Node.js, PostgreSQL, Docker, and cloud deployment.',
              sameAs: [
                'https://github.com/AHSANMOHAMMED',
                'https://www.linkedin.com/in/ahsan-m-s-m-13048b324/',
              ],
              knowsAbout: [
                'React', 'Next.js', 'Flutter', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript', 'REST APIs', 'GraphQL', 'Kubernetes'
              ],
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'SLIIT'
              },
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance / Open to Opportunities'
              }
            }),
          }}
        />
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
