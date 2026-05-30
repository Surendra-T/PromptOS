import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PromptOS — Illuminated Precision',
  description: 'Craft, refine, and perfect your prompts with a 4-agent AI pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
