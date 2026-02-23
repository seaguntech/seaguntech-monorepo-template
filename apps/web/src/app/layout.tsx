import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Seaguntech Monorepo Starter',
  description: 'Reusable monorepo template with shared packages.',
};

const themeScript = `(function(){try{var key='theme';var stored=localStorage.getItem(key);var systemDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(stored==='dark'||stored==='light')?stored:(systemDark?'dark':'light');document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(resolved);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="#ffffff" name="theme-color" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
