import type {Metadata} from 'next';
import { Spline_Sans, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css'; // Global styles

const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  weight: ['400', '700'],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-be-vietnam-pro',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AnimeKiwi',
  description: 'The ultimate cinematic anime streaming experience.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${splineSans.variable} ${beVietnamPro.variable}`}>
      <body className="font-body bg-[#131316] text-[#e4e1e6] antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
