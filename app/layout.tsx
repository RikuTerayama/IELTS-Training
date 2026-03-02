import type { Metadata } from 'next';

/** ビルド時の静的生成をスキップ（Supabase/認証依存のため） */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Inter } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

/** OGP用サイトURL。NEXT_PUBLIC_SITE_URL or SITE_URL を優先、未設定時は localhost */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'http://localhost:3000';

const SITE_TITLE = 'IELTS Training';
const SITE_DESCRIPTION = 'IELTS Writing/Speaking向けAI学習アプリ。スコアアップを最短ルートで。';

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
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_TITLE,
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: 'IELTS Training - AI-powered Writing & Speaking Practice',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/ogp.png'],
  },
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

