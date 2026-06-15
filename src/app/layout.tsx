import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'St Mirren FC Academy',
  description: 'Player performance data for the St Mirren FC Academy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-gray-800 mt-20 py-8">
          <p className="text-center text-gray-600 text-xs tracking-widest uppercase">
            St Mirren FC Academy · Player Analytics
          </p>
        </footer>
      </body>
    </html>
  );
}
