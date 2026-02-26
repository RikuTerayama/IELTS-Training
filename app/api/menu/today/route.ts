/**
 * GET /api/menu/today
 * 今日のメニューを返す（スタブ実装）
 * Step0: 型とZodバリデーションを通す
 */

import { successResponse, errorResponse } from '@/lib/api/response';
import { TodayMenuSchema, type TodayMenu } from '@/lib/api/schemas/menuToday';
import { createDummyUserXPState } from '@/lib/domain/xp';
import { createClient } from '@/lib/supabase/server';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    
    // 認証チェック（due件数を取得するため）
    const { data: { user } } = await supabase.auth.getUser();
    
    // 今日の日付を取得（Tokyo基準、YYYY-MM-DD形式）
    const dateStr = getTokyoDateString();

    // ダミーのXP状態
    const xp = createDummyUserXPState();

    // Lexicon/Idiom/Vocab due件数を取得（認証済みの場合のみ）
    let lexiconDueClick = 0;
    let lexiconDueTyping = 0;
    let idiomDueClick = 0;
    let idiomDueTyping = 0;
    let vocabDueClick = 0;
    let vocabDueTyping = 0;
    
    if (user) {
      const today = getTokyoDateString();
      
      // Lexicon clickモードのdue件数
      const { data: lexiconDueClickStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'click')
        .eq('module', 'lexicon')
        .lte('next_review_on', today);
      
      lexiconDueClick = lexiconDueClickStates?.length || 0;

      // Lexicon typingモードのdue件数
      const { data: lexiconDueTypingStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'typing')
        .eq('module', 'lexicon')
        .lte('next_review_on', today);
      
      lexiconDueTyping = lexiconDueTypingStates?.length || 0;

      // Idiom clickモードのdue件数
      const { data: idiomDueClickStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'click')
        .eq('module', 'idiom')
        .lte('next_review_on', today);
      
      idiomDueClick = idiomDueClickStates?.length || 0;

      // Idiom typingモードのdue件数
      const { data: idiomDueTypingStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'typing')
        .eq('module', 'idiom')
        .lte('next_review_on', today);
      
      idiomDueTyping = idiomDueTypingStates?.length || 0;

      // Vocab clickモードのdue件数
      const { data: vocabDueClickStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'click')
        .eq('module', 'vocab')
        .lte('next_review_on', today);
      
      vocabDueClick = vocabDueClickStates?.length || 0;

      // Vocab typingモードのdue件数
      const { data: vocabDueTypingStates } = await supabase
        .from('lexicon_srs_state')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('mode', 'typing')
        .eq('module', 'vocab')
        .lte('next_review_on', today);
      
      vocabDueTyping = vocabDueTypingStates?.length || 0;
    }

    // スタブデータ: Inputセクション（最小3件）
    const inputModules: TodayMenu['input'] = [
      {
        module: "vocab",
        title: "語彙練習",
        description: vocabDueClick + vocabDueTyping > 0
          ? `単語の意味を覚えましょう（Due: ${vocabDueClick + vocabDueTyping}）`
          : "単語の意味を覚えましょう",
        cta: {
          label: "開始",
          href: "/training/vocab",
        },
      },
      {
        module: "idiom",
        title: "熟語練習",
        description: idiomDueClick + idiomDueTyping > 0
          ? `イディオムを覚えましょう（Due: ${idiomDueClick + idiomDueTyping}）`
          : "イディオムを覚えましょう",
        cta: {
          label: "開始",
          href: "/training/idiom",
        },
      },
      {
        module: "lexicon",
        title: "表現バンク",
        description: lexiconDueClick + lexiconDueTyping > 0
          ? `よく使う表現を覚えましょう（Due: ${lexiconDueClick + lexiconDueTyping}）`
          : "よく使う表現を覚えましょう",
        cta: {
          label: "開始",
          href: "/training/lexicon",
        },
      },
    ];

    // Outputセクション: Speaking と Writing Task2 のみ（学習導線の整理）
    const outputModules: TodayMenu['output'] = [
      {
        module: "speaking",
        title: "Speaking",
        description: "Task1〜3をカテゴリごとに練習。使う表現を見ながら話す練習",
        cta: {
          label: "選ぶ",
          href: "/training/speaking",
    // スタブデータ: Outputセクション（最小3件）
    const outputModules: TodayMenu['output'] = [
      {
        module: "writing_task1",
        title: "Writing Task 1",
        description: "グラフ・図表・地図の説明",
        cta: {
          label: "開始",
          href: "/training/writing/task1",
        },
      },
      {
        module: "writing_task2",
        title: "Writing Task 2",
        description: "エッセイライティング",
        cta: {
          label: "開始",
          href: "/training/writing/task2",
        },
      },
      {
        module: "speaking",
        title: "Speaking練習",
        description: "瞬間英作文・スピーキング",
        cta: {
          label: "開始",
          href: "/training/speaking/task1",
        },
      },
    ];

    // 通知: Lexicon/Idiom/Vocab due件数（認証済みでdueがある場合のみ）
    const notices: TodayMenu['notices'] = [];
    if (user && (lexiconDueClick > 0 || lexiconDueTyping > 0)) {
      notices.push({
        type: "info",
        message: `Lexicon reviews due today: click ${lexiconDueClick}, typing ${lexiconDueTyping}`,
      });
    }
    if (user && (idiomDueClick > 0 || idiomDueTyping > 0)) {
      notices.push({
        type: "info",
        message: `Idiom reviews due today: click ${idiomDueClick}, typing ${idiomDueTyping}`,
      });
    }
    if (user && (vocabDueClick > 0 || vocabDueTyping > 0)) {
      notices.push({
        type: "info",
        message: `Vocab reviews due today: click ${vocabDueClick}, typing ${vocabDueTyping}`,
      });
    }

    // レスポンスデータを構築
    const menuData: TodayMenu = {
      date: dateStr,
      xp,
      input: inputModules,
      output: outputModules,
      notices,
    };

    // Zodバリデーション
    const validationResult = TodayMenuSchema.safeParse(menuData);
    if (!validationResult.success) {
      console.error('[GET /api/menu/today] Validation error:', validationResult.error);
      return Response.json(
        errorResponse(
          'VALIDATION_ERROR',
          'Menu data validation failed',
          validationResult.error.errors
        ),
        { status: 500 }
      );
    }

    // バリデーション通過後、成功レスポンスを返す
    return Response.json(successResponse(validationResult.data));
  } catch (error) {
    console.error('[GET /api/menu/today] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
