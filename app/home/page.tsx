'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import type { TodayMenu } from '@/lib/api/schemas/menuToday';
import type { ApiResponse } from '@/lib/api/response';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';

export default function HomePage() {
  const [menu, setMenu] = useState<TodayMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 今日のメニュー取得
    fetch('/api/menu/today')
      .then((res) => res.json())
      .then((data: ApiResponse<TodayMenu>) => {
        if (data.ok && data.data) {
          setMenu(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Lv/Exp表示（Step0はダミー、小さめに表示） */}
          {menu && (
            <div className={cn('p-4', cardBase)}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Input Level</div>
                  <div className="text-sm text-text">
                    Lv.{menu.xp.input.level} ({menu.xp.input.exp} / {menu.xp.input.nextLevelExp} exp)
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Output Level</div>
                  <div className="text-sm text-text">
                    Lv.{menu.xp.output.level} ({menu.xp.output.exp} / {menu.xp.output.nextLevelExp} exp)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inputセクション */}
          {menu && menu.input.length > 0 && (
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>📚 Input（定着: 認知と想起）</h2>
              <p className={cn('mb-4 text-sm', cardDesc)}>
                語彙・熟語・表現を覚えましょう
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {menu.input.map((item) => (
                  <Link
                    key={item.module}
                    href={item.cta.href}
                    className={cn(
                      'p-4 rounded-lg border-2 border-border bg-surface-2',
                      'hover:border-accent-emerald hover:bg-accent-emerald/10',
                      'transition-all duration-200 text-left',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
                    )}
                  >
                    <div className={cn('font-semibold text-lg mb-1', cardTitle)}>{item.title}</div>
                    <div className={cn('text-sm mb-3', cardDesc)}>{item.description}</div>
                    <span className={cn('text-sm', buttonPrimary, 'inline-block')}>
                      {item.cta.label} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Outputセクション */}
          {menu && menu.output.length > 0 && (
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>✍️ Output（運用: 使わせる制約）</h2>
              <p className={cn('mb-4 text-sm', cardDesc)}>
                覚えた語彙・表現を実際に使いましょう
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {menu.output.map((item) => (
                  <Link
                    key={item.module}
                    href={item.cta.href}
                    className={cn(
                      'p-4 rounded-lg border-2 border-border bg-surface-2',
                      'hover:border-accent-indigo hover:bg-accent-indigo/10',
                      'transition-all duration-200 text-left',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
                    )}
                  >
                    <div className={cn('font-semibold text-lg mb-1', cardTitle)}>{item.title}</div>
                    <div className={cn('text-sm mb-3', cardDesc)}>{item.description}</div>
                    <span className={cn('text-sm', buttonPrimary, 'inline-block')}>
                      {item.cta.label} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 通知（あれば表示） */}
          {menu && menu.notices && menu.notices.length > 0 && (
            <div className={cn('p-4', cardBase)}>
              <h3 className={cn('mb-2 text-sm font-semibold', cardTitle)}>お知らせ</h3>
              <div className="space-y-2">
                {menu.notices.map((notice, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-md text-sm',
                      notice.type === 'warning'
                        ? 'bg-warning-bg border border-warning-border text-warning'
                        : 'bg-surface-2 text-text-muted'
                    )}
                  >
                    {notice.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogセクション（既存） */}
          <div className={cn('p-6', cardBase)}>
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>📝 Blog</h2>
            <p className={cn('mb-4', cardDesc)}>
              IELTS学習に役立つ記事や最新情報をお届けします
            </p>
            <a
              href="https://ieltsconsult.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-accent-emerald px-4 py-2 text-accent-emerald-foreground hover:bg-accent-emerald-hover transition-colors duration-200"
            >
              Blogを読む →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

