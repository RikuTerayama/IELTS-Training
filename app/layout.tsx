import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Meridian',
  description: 'Meridian | IELTS Reading / Writing / Speaking 学習アプリ',
  icons: {
    icon: '/branding/meridian.png',
    shortcut: '/branding/meridian.png',
    apple: '/branding/meridian.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
      // system 縺ｾ縺溘・ 譛ｪ險ｭ螳壹・蝣ｴ蜷・      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  } catch (e) {
    // 繧ｨ繝ｩ繝ｼ譎ゅ・繝・ヵ繧ｩ繝ｫ繝医〒dark
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
