'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import type { TodayMenu } from '@/lib/api/schemas/menuToday';
import type { ApiResponse } from '@/lib/api/response';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';

/** AC-O1: Output は API 失敗時も消えないようフォールバックを常時利用 */
const OUTPUT_FALLBACK: { module: string; title: string; description: string; cta: { label: string; href: string } }[] = [
  {
    module: 'speaking',
    title: 'Speaking',
    description: 'Task1〜3の瞬間英作文（カテゴリ×Taskで練習）',
    cta: { label: '練習する', href: '/training/speaking' },
  },
  {
    module: 'writing_task2',
    title: 'Writing Task 2',
    description: 'エッセイを書く練習（穴埋め→Reasoning→自由作成）',
    cta: { label: 'タスクを選ぶ', href: '/task/select?task_type=Task%202' },
  },
];

/** AC-1: Input カテゴリは API に依存せず常に表示。4技能固定順: Reading→Listening→Speaking→Writing */
const INPUT_CATEGORIES = [
  {
    module: 'vocab' as const,
    title: '語彙練習',
    description: '単語の意味を覚えましょう',
    skills: [
      { skill: 'reading' as const, label: 'Reading', href: '', disabled: true },
      { skill: 'listening' as const, label: 'Listening', href: '', disabled: true },
      { skill: 'speaking' as const, label: 'Speaking', href: '/training/vocab?skill=speaking', disabled: false },
      { skill: 'writing' as const, label: 'Writing', href: '/training/vocab?skill=writing', disabled: false },
    ],
  },
  {
    module: 'idiom' as const,
    title: '熟語練習',
    description: 'イディオムを覚えましょう',
    skills: [
      { skill: 'reading' as const, label: 'Reading', href: '', disabled: true },
      { skill: 'listening' as const, label: 'Listening', href: '', disabled: true },
      { skill: 'speaking' as const, label: 'Speaking', href: '/training/idiom?skill=speaking', disabled: false },
      { skill: 'writing' as const, label: 'Writing', href: '/training/idiom?skill=writing', disabled: false },
    ],
  },
  {
    module: 'lexicon' as const,
    title: '表現バンク',
    description: 'よく使う表現を覚えましょう',
    skills: [
      { skill: 'reading' as const, label: 'Reading', href: '', disabled: true },
      { skill: 'listening' as const, label: 'Listening', href: '', disabled: true },
      { skill: 'speaking' as const, label: 'Speaking', href: '/training/lexicon?skill=speaking', disabled: false },
      { skill: 'writing' as const, label: 'Writing', href: '/training/lexicon?skill=writing', disabled: false },
    ],
  },
];

// アイコン（SVG）
const Icons = {
  Book: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Sparkles: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
  Pencil: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
  Mic: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>,
  TrendingUp: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
  FileText: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  ArrowRight: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
};

export default function HomePage() {
  const [menu, setMenu] = useState<TodayMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/menu/today')
      .then((res) => res.json())
      .then((data: ApiResponse<TodayMenu>) => {
        if (data.data) setMenu(data.data);
      })
      .catch(() => {
        // API失敗時は menu を null のまま。Output は OUTPUT_FALLBACK で常時表示
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-slate-500">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  // モジュールアイコンマッピング
  const getModuleIcon = (module: string) => {
    const iconMap: Record<string, any> = {
      vocab: <Icons.Book className="w-6 h-6" />,
      idiom: <Icons.Sparkles className="w-6 h-6" />,
      lexicon: <Icons.FileText className="w-6 h-6" />,
      writing_task1: <Icons.TrendingUp className="w-6 h-6" />,
      writing_task2: <Icons.Pencil className="w-6 h-6" />,
      speaking: <Icons.Mic className="w-6 h-6" />,
    };
    return iconMap[module] || <Icons.Book className="w-6 h-6" />;
  };

  // モジュールカラー
  const getModuleColor = (module: string, isInput: boolean) => {
    if (isInput) {
      const colorMap: Record<string, string> = {
        vocab: 'amber',
        idiom: 'purple',
        lexicon: 'blue',
      };
      return colorMap[module] || 'indigo';
    } else {
      const colorMap: Record<string, string> = {
        writing_task1: 'emerald',
        writing_task2: 'indigo',
        speaking: 'pink',
      };
      return colorMap[module] || 'indigo';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* ヒーローセクション */}
          <div className="text-center mb-12">
            <h1 className="text-heading-1 font-bold tracking-tight text-text mb-3">
              Today's Menu
            </h1>
            <p className="text-body-lg text-text-muted">
              今日の学習メニューを確認して、効率的にスキルアップしましょう
            </p>
          </div>

          {/* Lv/Exp表示（洗練されたデザイン） */}
          {menu && (
            <div className={cn('p-6', cardBase)}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Input Level</span>
                    <span className="text-xs text-slate-400">{menu.xp.input.exp} / {menu.xp.input.nextLevelExp} exp</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-indigo-600">Lv.{menu.xp.input.level}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (menu.xp.input.exp / menu.xp.input.nextLevelExp) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output Level</span>
                    <span className="text-xs text-slate-400">{menu.xp.output.exp} / {menu.xp.output.nextLevelExp} exp</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-emerald-600">Lv.{menu.xp.output.level}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (menu.xp.output.exp / menu.xp.output.nextLevelExp) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inputセクション - AC-1: 常に表示。4技能固定順: Reading→Listening→Speaking→Writing */}
          <div>
            <div className="mb-6">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-2">Input</h2>
              <p className="text-body text-text-muted">語彙・熟語・表現を覚えましょう（定着: 認知と想起）</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 min-w-0">
              {INPUT_CATEGORIES.map((cat) => {
                const color = getModuleColor(cat.module, true);
                const colorClasses: Record<string, string> = {
                  amber: 'bg-amber-50 border-amber-200 text-amber-600',
                  purple: 'bg-purple-50 border-purple-200 text-purple-600',
                  blue: 'bg-blue-50 border-blue-200 text-blue-600',
                  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
                };
                const iconBg = colorClasses[color] || colorClasses.indigo;
                return (
                  <div
                    key={cat.module}
                    className={cn(
                      'p-6 rounded-2xl border border-border bg-surface min-w-0',
                      'focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2'
                    )}
                  >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', iconBg)}>
                      {getModuleIcon(cat.module)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{cat.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s) =>
                        s.disabled ? (
                          <span
                            key={s.skill}
                            className={cn(
                              'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm',
                              'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70',
                              'border border-slate-200'
                            )}
                          >
                            {s.label}
                            <span className="text-xs">Coming soon</span>
                          </span>
                        ) : (
                          <Link
                            key={s.skill}
                            href={s.href}
                            className={cn(
                              'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold',
                              'bg-indigo-50 text-indigo-600 border border-indigo-200',
                              'hover:bg-indigo-100 hover:border-indigo-300 transition-all',
                              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500'
                            )}
                          >
                            {s.label}
                            <Icons.ArrowRight className="w-4 h-4" />
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outputセクション - AC-O1: 常時表示（API失敗時はフォールバック） */}
          <div>
            <div className="mb-6">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-2">Output</h2>
              <p className="text-body text-text-muted">覚えた語彙・表現を実際に使いましょう（運用: 使わせる制約）</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(menu?.output?.length ? menu.output : OUTPUT_FALLBACK).map((item) => {
                  const color = getModuleColor(item.module, false);
                  const colorClasses: Record<string, string> = {
                    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
                    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
                    pink: 'bg-pink-50 border-pink-200 text-pink-600',
                  };
                  const iconBg = colorClasses[color] || colorClasses.indigo;
                  
                  return (
                    <Link
                      key={item.module}
                      href={item.cta.href}
                      className={cn(
                        'group p-6 rounded-2xl border border-border bg-surface',
                        'hover:shadow-md hover:-translate-y-1 hover:border-slate-300',
                        'transition-all duration-200 text-left',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                      )}
                    >
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', iconBg)}>
                        {getModuleIcon(item.module)}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                        {item.cta.label}
                        <Icons.ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* 通知（あれば表示） */}
          {menu && menu.notices && menu.notices.length > 0 && (
            <div className={cn('p-6', cardBase)}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">お知らせ</h3>
              <div className="space-y-3">
                {menu.notices.map((notice, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-4 rounded-xl text-sm border',
                      notice.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    )}
                  >
                    {notice.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogセクション */}
          <div className={cn('p-6', cardBase)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Icons.FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Blog</h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  IELTS学習に役立つ記事や最新情報をお届けします
                </p>
                <a
                  href="https://ieltsconsult.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('inline-flex items-center gap-2', buttonPrimary)}
                >
                  Blogを読む
                  <Icons.ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

