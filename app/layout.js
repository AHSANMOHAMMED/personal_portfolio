import { Geist, Geist_Mono, Baloo_2, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/styles/reference/portfolio-home.css";
import { SITE_URL, assetUrl } from '@/lib/siteConfig';

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

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
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
      { url: `${assetUrl('/favicons/favicon-16x16.png')}?v=3`, sizes: '16x16', type: 'image/png' },
      { url: `${assetUrl('/favicons/favicon-32x32.png')}?v=3`, sizes: '32x32', type: 'image/png' },
      { url: `${assetUrl('/favicons/favicon-48x48.png')}?v=3`, sizes: '48x48', type: 'image/png' },
      { url: `${assetUrl('/favicons/favicon.ico')}?v=3`, sizes: 'any' },
      { url: `${assetUrl('/favicon.ico')}?v=3`, sizes: 'any' },
      { url: `${assetUrl('/favicon.png')}?v=3`, type: 'image/png' },
    ],
    shortcut: `${assetUrl('/favicons/favicon-32x32.png')}?v=3`,
    apple: [
      { url: `${assetUrl('/favicons/apple-touch-icon.png')}?v=3` },
      { url: `${assetUrl('/favicons/apple-touch-icon-180x180.png')}?v=3`, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: `${assetUrl('/favicons/android-chrome-192x192.png')}?v=3`, sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: `${assetUrl('/favicons/android-chrome-512x512.png')}?v=3`, sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: assetUrl('/favicons/manifest.webmanifest'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={`${assetUrl('/favicons/favicon-32x32.png')}?v=3`} type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href={`${assetUrl('/favicons/favicon.ico')}?v=3`} />
        <link rel="apple-touch-icon" href={`${assetUrl('/favicons/apple-touch-icon.png')}?v=3`} />
        <link rel="manifest" href={assetUrl('/favicons/manifest.webmanifest')} />
      </head>
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
        {children}
      </body>
    </html>
  );
}
