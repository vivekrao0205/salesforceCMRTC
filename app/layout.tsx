import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';

export const metadata: Metadata = {
  title: 'Salesforce Club CMRTC — Learn. Build. Connect.',
  description:
    'Salesforce Club CMRTC — A student community at CMR Technical Campus exploring Salesforce, cloud technology, AI, automation, and practical enterprise development.',
  icons: {
    icon: '/images/logo.png',
  },
  openGraph: {
    title: 'Salesforce Club CMRTC',
    description: 'A student community at CMR Technical Campus exploring Salesforce, cloud technology, AI, and development.',
    url: 'https://salesforceclubcmrtc.ac.in',
    siteName: 'Salesforce Club CMRTC',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'Salesforce Club CMRTC Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
