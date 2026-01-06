import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IELTS Writing Training',
  description: 'IELTS Writing/Speaking向け学習アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${inter.variable} ${notoSansJP.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var themeMode = localStorage.getItem('themeMode');
    var resolvedTheme;
    
    if (themeMode === 'light' || themeMode === 'dark') {
      resolvedTheme = themeMode;
    } else {
      // system または 未設定の場合
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  } catch (e) {
    // エラー時はデフォルトでdark
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

