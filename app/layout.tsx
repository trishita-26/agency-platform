import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agency Platform',
  description: 'Marketing Agency Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}