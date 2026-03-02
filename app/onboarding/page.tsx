'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Layout } from '@/components/layout/Layout';

type Level = 'beginner' | 'intermediate' | 'advanced';

type Purpose = 
  | 'university_admission'
  | 'work_visa'
  | 'immigration'
  | 'professional_certification'
  | 'personal_development'
  | 'other';

interface PurposeOption {
  value: Purpose;
  label: string;
  description: string;
}

const purposeOptions: PurposeOption[] = [
  { value: 'university_admission', label: '大学入学', description: '海外の大学に入学するため' },
  { value: 'work_visa', label: '就労ビザ取得', description: '海外で働くためのビザ取得のため' },
  { value: 'immigration', label: '移住', description: '海外に移住するため' },
  { value: 'professional_certification', label: '専門資格取得', description: '専門的な資格を取得するため' },
  { value: 'personal_development', label: '自己啓発', description: '英語力を向上させるため' },
  { value: 'other', label: 'その他', description: 'その他の目的' },
];

const levelLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

const levelDescriptions = {
  beginner: '基本的な文法と語彙を理解できる。簡単な文章を書くことができる。',
  intermediate: '日常的な話題について、ある程度複雑な文章を書くことができる。',
  advanced: '複雑な話題について、論理的に構成された文章を書くことができる。',
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1); // 1: 目的, 2: 現状レベル, 3: 推奨レベル提案, 4: レベル登録
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [recommendedLevel, setRecommendedLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 既にonboarding完了している場合はホームにリダイレクト
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      router.push('/home');
    }
  };

  const handlePurposeSelect = (selectedPurpose: Purpose) => {
    setPurpose(selectedPurpose);
    setStep(2);
  };

  const handleCurrentLevelSelect = (level: Level) => {
    setCurrentLevel(level);
    // 推奨レベルを計算
    if (purpose) {
      const recommended = calculateRecommendedLevel(purpose, level);
      setRecommendedLevel(recommended);
    } else {
      setRecommendedLevel(level);
    }
    setStep(3);
  };

  const calculateRecommendedLevel = (purpose: Purpose, currentLevel: Level): Level => {
    // 推奨ロジック
    if (purpose === 'university_admission' || purpose === 'professional_certification') {
      // 大学入学や専門資格は上級を目指す
      if (currentLevel === 'beginner') return 'intermediate';
      if (currentLevel === 'intermediate') return 'advanced';
      return 'advanced';
    } else if (purpose === 'work_visa' || purpose === 'immigration') {
      // 就労ビザや移住は中級以上を目指す
      if (currentLevel === 'beginner') return 'intermediate';
      return currentLevel;
    }
    // その他の目的は現状レベルを維持
    return currentLevel;
  };

  const handleConfirmRecommendedLevel = () => {
    setStep(4);
  };

  const handleChangeRecommendedLevel = (level: Level) => {
    setRecommendedLevel(level);
  };

  const handleComplete = async () => {
    if (!recommendedLevel) {
      setError('レベルを選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      // プロファイルを更新
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          initial_level: recommendedLevel,
          current_level: recommendedLevel,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // ホームにリダイレクト
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-muted">ステップ {step} / 4</span>
              <span className="text-sm text-text-muted">
                {step === 1 && '目的を選択'}
                {step === 2 && '現状レベルを選択'}
                {step === 3 && '推奨レベルを確認'}
                {step === 4 && 'レベルを登録'}
              </span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* ステップ1: 目的選択 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text mb-2">
                  IELTSを受験する目的を教えてください
                </h2>
                <p className="text-text-muted">
                  あなたの目的に合わせて、最適な学習プランを提案します。
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {purposeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePurposeSelect(option.value)}
                    className="text-left p-4 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-surface-2 transition-all"
                  >
                    <div className="font-semibold text-text mb-1">{option.label}</div>
                    <div className="text-sm text-text-muted">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ステップ2: 現状レベル選択 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                  ← 戻る
                </button>
                <h2 className="text-2xl font-bold text-text mb-2">
                  現在のIELTS Writingレベルを教えてください
                </h2>
                <p className="text-text-muted">
                  あなたの現在のレベルを選択してください。正確な評価ができなくても、おおよそのレベルで問題ありません。
                </p>
              </div>
              <div className="space-y-4">
                {(Object.keys(levelLabels) as Level[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleCurrentLevelSelect(level)}
                    className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                      currentLevel === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-border hover:border-blue-300 hover:bg-surface-2'
                    }`}
                  >
                    <div className="font-semibold text-lg text-text mb-2">
                      {levelLabels[level]}
                    </div>
                    <div className="text-sm text-text-muted">
                      {levelDescriptions[level]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ステップ3: 推奨レベル提案 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                  ← 戻る
                </button>
                <h2 className="text-2xl font-bold text-text mb-2">
                  推奨レベル
                </h2>
                <p className="text-text-muted">
                  あなたの目的と現状レベルに基づいて、以下のレベルを推奨します。
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-sm text-blue-800 mb-2">推奨レベル</div>
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  {recommendedLevel && levelLabels[recommendedLevel]}
                </div>
                <div className="text-sm text-blue-700">
                  {recommendedLevel && levelDescriptions[recommendedLevel]}
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-sm font-medium text-text mb-2">
                  推奨レベルを変更する場合は、以下から選択してください：
                </div>
                {(Object.keys(levelLabels) as Level[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleChangeRecommendedLevel(level)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      recommendedLevel === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="font-semibold text-text">
                      {levelLabels[level]}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleConfirmRecommendedLevel}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  このレベルで進める
                </button>
              </div>
            </div>
          )}

          {/* ステップ4: レベル登録 */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep(3)}
                  className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                  ← 戻る
                </button>
                <h2 className="text-2xl font-bold text-text mb-2">
                  レベル登録
                </h2>
                <p className="text-text-muted">
                  選択したレベルで学習を開始します。後から変更することもできます。
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-text-muted">目的</div>
                    <div className="font-semibold text-text">
                      {purpose && purposeOptions.find(o => o.value === purpose)?.label}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">現状レベル</div>
                    <div className="font-semibold text-text">
                      {currentLevel && levelLabels[currentLevel]}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">学習レベル</div>
                    <div className="font-semibold text-blue-600 text-lg">
                      {recommendedLevel && levelLabels[recommendedLevel]}
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 border border-border text-text rounded-md hover:bg-surface-2 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '登録中...' : '学習を開始する'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

