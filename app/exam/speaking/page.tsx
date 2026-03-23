'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import {
  bodyText,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  cardTitle,
  cn,
  helperText,
  pageTitle,
  sectionTitle,
  textareaBase,
} from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';
import {
  getUserFacingSubmissionError,
  getUserFacingTranscriptionError,
  isUnauthorizedApiResponse,
  redirectToLoginWithNext,
} from '@/lib/api/clientError';
import { SPEAKING_TOPICS } from '@/lib/content/speakingTopics';

type Phase =
  | 'idle'
  | 'creating_session'
  | 'generating_prompt'
  | 'answering'
  | 'saving_attempt'
  | 'evaluating'
  | 'done'
  | 'error';

type VoiceInputState = 'idle' | 'recording' | 'transcribing';

type SpeakingEvaluationPromptPayload = {
  part: string;
  question_text: string;
  jp_intent: string;
  model_answer?: string;
  expected_style?: string;
  time_limit?: number;
};

const TOPICS = SPEAKING_TOPICS.map((topic) => ({
  value: topic.apiTopic,
  label: `${topic.titleJa}\uff08${topic.titleEn}\uff09`,
}));

const LEVELS = [
  { value: 'beginner', label: '\u521d\u7d1a' },
  { value: 'intermediate', label: '\u4e2d\u7d1a' },
  { value: 'advanced', label: '\u4e0a\u7d1a' },
] as const;

const PARTS = [
  { value: 'part1', label: 'Part 1', help: '\u8eab\u8fd1\u306a\u8cea\u554f\u306b\u77ed\u304f\u7b54\u3048\u308b\u30d1\u30fc\u30c8\u3067\u3059\u3002' },
  { value: 'part2', label: 'Part 2 / Cue Card', help: '1\u301c2 \u5206\u3067\u8a71\u3059\u30d1\u30fc\u30c8\u3067\u3059\u3002' },
  { value: 'part3', label: 'Part 3', help: '\u62bd\u8c61\u5ea6\u306e\u9ad8\u3044\u8b70\u8ad6\u3078\u5e83\u3052\u308b\u30d1\u30fc\u30c8\u3067\u3059\u3002' },
] as const;

const LEVEL_TO_API: Record<string, string> = {
  beginner: 'B1',
  intermediate: 'B2',
  advanced: 'C1',
};

const MIN_ANSWER_LENGTH = 30;
const AUDIO_TRANSCRIPTION_RETRY_MESSAGE =
  '文字起こしに失敗しました。もう一度録音するか、テキストで回答してください。';
const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
] as const;

const EVALUATION_LABELS: Record<string, string> = {
  fluency_band: '流暢さ',
  lexical_band: '語彙',
  grammar_band: '文法',
  pronunciation_band: '発音',
};

type UsageTodayData = {
  is_pro: boolean;
  writing_limit: number;
  speaking_limit: number;
  writing_remaining: number;
  speaking_remaining: number;
  reset_at: string;
};

function buildPromptText(promptRow: Record<string, unknown>): string {
  const followup = promptRow?.followup_question as string | undefined;
  const question = promptRow?.question as string | undefined;
  const jpIntent = promptRow?.jp_intent as string | undefined;
  if (followup && String(followup).trim()) return String(followup).trim();
  if (question && String(question).trim()) return String(question).trim();
  if (jpIntent && String(jpIntent).trim()) return `(Intent) ${String(jpIntent).trim()}`;
  return '\u8cea\u554f\u6587\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002';
}

function buildEvaluationPromptPayload(
  promptRow: Record<string, unknown>,
  selectedPart: string
): SpeakingEvaluationPromptPayload {
  const cueCard = promptRow?.cue_card as { topic?: string; points?: string[] } | undefined;
  const cueCardText =
    selectedPart === 'part2' &&
    cueCard &&
    (cueCard.topic || (Array.isArray(cueCard.points) && cueCard.points.length > 0))
      ? [
          cueCard.topic ?? '',
          ...(Array.isArray(cueCard.points) ? cueCard.points.map((point) => `- ${point}`) : []),
        ]
          .filter(Boolean)
          .join('\n')
      : undefined;

  return {
    part: selectedPart,
    question_text: cueCardText || buildPromptText(promptRow),
    jp_intent:
      typeof promptRow.jp_intent === 'string' && promptRow.jp_intent.trim()
        ? promptRow.jp_intent.trim()
        : buildPromptText(promptRow),
    model_answer:
      typeof promptRow.model_answer === 'string' && promptRow.model_answer.trim()
        ? promptRow.model_answer.trim()
        : undefined,
    expected_style:
      typeof promptRow.expected_style === 'string' && promptRow.expected_style.trim()
        ? promptRow.expected_style.trim()
        : undefined,
    time_limit:
      typeof promptRow.time_limit === 'number'
        ? promptRow.time_limit
        : undefined,
  };
}

function getPreferredRecorderMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return undefined;
  return RECORDER_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

function getAudioFileExtension(mimeType: string): string {
  const normalized = mimeType.split(';')[0].trim().toLowerCase();
  if (normalized === 'audio/mp4') return 'm4a';
  if (normalized === 'audio/ogg') return 'ogg';
  if (normalized === 'audio/wav' || normalized === 'audio/x-wav' || normalized === 'audio/wave') return 'wav';
  return 'webm';
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/exam/speaking';
  return `${window.location.pathname}${window.location.search}`;
}

export default function ExamSpeakingPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [usageToday, setUsageToday] = useState<UsageTodayData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [topic, setTopic] = useState<string>(TOPICS[0].value);
  const [level, setLevel] = useState<string>(LEVELS[0].value);
  const [selectedPart, setSelectedPart] = useState<string>(PARTS[0].value);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptRow, setPromptRow] = useState<Record<string, unknown> | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedbackRow, setFeedbackRow] = useState<Record<string, unknown> | null>(null);
  const [voiceInputState, setVoiceInputState] = useState<VoiceInputState>('idle');
  const [voiceErrorMessage, setVoiceErrorMessage] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [canRecordAudio, setCanRecordAudio] = useState(false);
  const [answerInputSource, setAnswerInputSource] = useState<'text' | 'voice'>('text');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined';
    setCanRecordAudio(supported);
  }, []);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    fetch('/api/usage/today')
      .then((res) => res.json())
      .then((data: ApiResponse<UsageTodayData>) => {
        if (data.ok && data.data) setUsageToday(data.data);
      })
      .catch(() => {});
  }, []);

  const isLoading =
    phase === 'creating_session' ||
    phase === 'generating_prompt' ||
    phase === 'saving_attempt' ||
    phase === 'evaluating';

  const usageMessage = useMemo(() => {
    if (!usageToday) return null;
    if (usageToday.is_pro) {
      return 'Pro \u5229\u7528\u4e2d\u3067\u3059\u3002Speaking AI \u3092\u7d99\u7d9a\u3057\u3066\u4f7f\u3048\u307e\u3059\u3002';
    }
    if (usageToday.speaking_remaining === 0) {
      return '\u4eca\u65e5\u306e Speaking AI \u6b8b\u308a\u56de\u6570\u306f 0 \u3067\u3059\u3002\u7d9a\u3051\u3066\u4f7f\u3046\u5834\u5408\u306f\u6599\u91d1\u30da\u30fc\u30b8\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
    }
    if (usageToday.speaking_remaining === 1) {
      return '\u4eca\u65e5\u306e Speaking AI \u6b8b\u308a\u56de\u6570\u306f 1 \u56de\u3067\u3059\u3002';
    }
    return `\u4eca\u65e5\u306e Speaking AI \u6b8b\u308a\u56de\u6570\u306f ${usageToday.speaking_remaining} \u56de\u3067\u3059\u3002`;
  }, [usageToday]);

  const handleStartInterview = async () => {
    setErrorMessage(null);
    setVoiceErrorMessage(null);
    setVoiceNotice(null);
    setLastTranscript('');
    setAnswerInputSource('text');
    setPhase('creating_session');

    try {
      const sessionRes = await fetch('/api/speaking/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'mock',
          part: selectedPart,
          topic,
          level: LEVEL_TO_API[level] || level || undefined,
        }),
      });
      const sessionData = (await sessionRes.json()) as ApiResponse<{ id: string }>;
      if (isUnauthorizedApiResponse(sessionRes, sessionData)) {
        redirectToLoginWithNext(getCurrentPath());
        return;
      }
      if (!sessionData.ok || !sessionData.data?.id) {
        setErrorMessage(
          getUserFacingSubmissionError(
            sessionRes,
            sessionData,
            '\u9762\u63a5\u30bb\u30c3\u30b7\u30e7\u30f3\u306e\u958b\u59cb\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002'
          )
        );
        setPhase('error');
        return;
      }
      setSessionId(sessionData.data.id);

      setPhase('generating_prompt');
      const promptRes = await fetch('/api/speaking/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionData.data.id,
          mode: 'mock',
          topic,
          part: selectedPart,
          level: LEVEL_TO_API[level] || level || undefined,
          use_preset: true,
        }),
      });
      const promptData = (await promptRes.json()) as ApiResponse<Record<string, unknown>>;
      if (isUnauthorizedApiResponse(promptRes, promptData)) {
        redirectToLoginWithNext(getCurrentPath());
        return;
      }
      if (!promptData.ok || !promptData.data) {
        setErrorMessage(
          getUserFacingSubmissionError(
            promptRes,
            promptData,
            '\u8cea\u554f\u306e\u751f\u6210\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002'
          )
        );
        setPhase('error');
        return;
      }
      setPromptRow(promptData.data);
      setAnswer('');
      setPhase('answering');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '\u901a\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002');
      setPhase('error');
    }
  };

  const transcribeAudioBlob = async (audioBlob: Blob, mimeType: string) => {
    setVoiceInputState('transcribing');
    setVoiceErrorMessage(null);
    setVoiceNotice(null);

    try {
      const formData = new FormData();
      formData.append(
        'audio',
        new File([audioBlob], `speaking-answer.${getAudioFileExtension(mimeType)}`, {
          type: mimeType,
        })
      );

      const transcriptionRes = await fetch('/api/speaking/transcriptions', {
        method: 'POST',
        body: formData,
      });
      const transcriptionData =
        (await transcriptionRes.json()) as ApiResponse<{ transcript: string }>;

      if (isUnauthorizedApiResponse(transcriptionRes, transcriptionData)) {
        redirectToLoginWithNext(getCurrentPath());
        return;
      }

      if (!transcriptionData.ok || !transcriptionData.data?.transcript) {
        setVoiceErrorMessage(
          getUserFacingTranscriptionError(
            transcriptionRes,
            transcriptionData,
            AUDIO_TRANSCRIPTION_RETRY_MESSAGE
          )
        );
        setVoiceInputState('idle');
        return;
      }

      const transcript = transcriptionData.data.transcript.trim();
      setLastTranscript(transcript);
      setAnswer((prev) => (prev.trim() ? `${prev.trim()}\n${transcript}` : transcript));
      setAnswerInputSource('voice');
      setVoiceNotice('文字起こしを反映しました。必要なら編集してから送信してください。');
      setVoiceInputState('idle');
    } catch {
      setVoiceErrorMessage(AUDIO_TRANSCRIPTION_RETRY_MESSAGE);
      setVoiceInputState('idle');
    }
  };

  const handleStartRecording = async () => {
    if (!canRecordAudio || voiceInputState === 'recording' || voiceInputState === 'transcribing') {
      return;
    }

    setVoiceErrorMessage(null);
    setVoiceNotice(null);
    setLastTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getPreferredRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recordedChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalMimeType = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(recordedChunksRef.current, { type: finalMimeType });
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        recordedChunksRef.current = [];

        if (audioBlob.size === 0) {
          setVoiceInputState('idle');
          setVoiceErrorMessage('録音データを取得できませんでした。もう一度録音してください。');
          return;
        }

        void transcribeAudioBlob(audioBlob, finalMimeType);
      };

      recorder.onerror = () => {
        setVoiceInputState('idle');
        setVoiceErrorMessage('録音に失敗しました。もう一度お試しください。');
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
      };

      recorder.start();
      setVoiceInputState('recording');
    } catch {
      setVoiceErrorMessage(
        'マイクを利用できませんでした。許可を確認するか、テキスト入力で続けてください。'
      );
      setVoiceInputState('idle');
    }
  };

  const handleStopRecording = () => {
    if (voiceInputState !== 'recording') return;
    mediaRecorderRef.current?.stop();
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || !promptRow || !promptRow.id) return;
    const trimmed = answer.trim();
    if (trimmed.length < MIN_ANSWER_LENGTH) {
      setErrorMessage(`\u56de\u7b54\u306f ${MIN_ANSWER_LENGTH} \u6587\u5b57\u4ee5\u4e0a\u3067\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002`);
      return;
    }

    setErrorMessage(null);
    setPhase('saving_attempt');

    try {
      const attemptRes = await fetch('/api/speaking/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          prompt_id: promptRow.id,
          user_response: trimmed,
        }),
      });
      const attemptData = (await attemptRes.json()) as ApiResponse<{ id: string }>;
      if (isUnauthorizedApiResponse(attemptRes, attemptData)) {
        redirectToLoginWithNext(getCurrentPath());
        return;
      }
      if (!attemptData.ok || !attemptData.data?.id) {
        setErrorMessage(
          getUserFacingSubmissionError(
            attemptRes,
            attemptData,
            '\u56de\u7b54\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u5185\u5bb9\u3092\u78ba\u8a8d\u3057\u3066\u3001\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002'
          )
        );
        setPhase('answering');
        return;
      }
      setAttemptId(attemptData.data.id);

      setPhase('evaluating');
      const evalRes = await fetch('/api/speaking/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptData.data.id,
          user_response: trimmed,
          prompt: buildEvaluationPromptPayload(promptRow, selectedPart),
          metrics: {
            word_count: trimmed.split(/\s+/).length,
            has_audio_transcript: answerInputSource === 'voice',
          },
        }),
      });
      const evalData = (await evalRes.json()) as ApiResponse<Record<string, unknown>>;
      if (isUnauthorizedApiResponse(evalRes, evalData)) {
        redirectToLoginWithNext(getCurrentPath());
        return;
      }
      if (!evalData.ok || !evalData.data) {
        setErrorMessage(
          getUserFacingSubmissionError(
            evalRes,
            evalData,
            '\u8a55\u4fa1\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\u6642\u9593\u3092\u304a\u3044\u3066\u3001\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002'
          )
        );
        setPhase('error');
        return;
      }
      setFeedbackRow(evalData.data);
      setPhase('done');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '\u901a\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002');
      setPhase('error');
    }
  };

  const handleTryAnother = () => {
    mediaRecorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    setPhase('idle');
    setErrorMessage(null);
    setVoiceErrorMessage(null);
    setVoiceNotice(null);
    setLastTranscript('');
    setVoiceInputState('idle');
    setAnswerInputSource('text');
    setSessionId(null);
    setPromptRow(null);
    setAttemptId(null);
    setFeedbackRow(null);
    setAnswer('');
  };

  const questionText = promptRow ? buildPromptText(promptRow) : '';
  const cueCard = promptRow?.cue_card as { topic?: string; points?: string[] } | undefined;
  const showCueCard =
    selectedPart === 'part2' &&
    cueCard &&
    (cueCard.topic || (Array.isArray(cueCard.points) && cueCard.points.length > 0));

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 space-y-3">
          <h1 className={pageTitle}>{'Speaking AI \u9762\u63a5'}</h1>
          <p className={cn(bodyText, 'max-w-2xl')}>
            {'Part 1 / 2 / 3 \u3092\u9078\u3073\u3001AI \u9762\u63a5\u5b98\u3068\u672c\u756a\u306b\u8fd1\u3044\u6d41\u308c\u3067\u7df4\u7fd2\u3057\u307e\u3059\u3002\u56de\u7b54\u5f8c\u306f\u8a55\u4fa1\u3092\u78ba\u8a8d\u3057\u3001\u305d\u306e\u307e\u307e\u6b21\u306e\u4e00\u554f\u3078\u9032\u3081\u307e\u3059\u3002'}
          </p>
        </header>

        {phase === 'error' && errorMessage ? (
          <div className={cn('mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900')}>
            <p className="font-medium">{errorMessage}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={handleTryAnother} className={buttonSecondary}>
                {'\u3082\u3046\u4e00\u5ea6\u8a66\u3059'}
              </button>
              <Link href="/home" className={cn(buttonSecondary, 'inline-flex items-center')}>
                {'\u5b66\u7fd2\u30db\u30fc\u30e0\u3078\u623b\u308b'}
              </Link>
            </div>
          </div>
        ) : null}

        {phase === 'idle' ? (
          <>
            {usageMessage ? (
              <div className={cn('mb-6 rounded-xl border border-border bg-surface p-4')}>
                <p className={helperText}>{usageMessage}</p>
                {!usageToday?.is_pro && usageToday?.speaking_remaining === 0 ? (
                  <div className="mt-3">
                    <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
                      {'\u6599\u91d1\u3092\u898b\u308b'}
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className={cn('p-6', cardBase)}>
              <h2 className={cn(sectionTitle, 'mb-4')}>{'\u8a2d\u5b9a'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">{'\u30c8\u30d4\u30c3\u30af'}</label>
                  <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-text">
                    {TOPICS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">{'Part'}</label>
                  <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-text">
                    {PARTS.map((part) => (
                      <option key={part.value} value={part.value}>{part.label}</option>
                    ))}
                  </select>
                  <p className={cn(helperText, 'mt-1 text-xs')}>
                    {PARTS.find((part) => part.value === selectedPart)?.help}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">{'\u30ec\u30d9\u30eb'}</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-text">
                    {LEVELS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={handleStartInterview} disabled={isLoading} className={cn('w-full sm:w-auto', buttonPrimary)}>
                  {isLoading ? '\u6e96\u5099\u4e2d...' : 'AI \u9762\u63a5\u3092\u59cb\u3081\u308b'}
                </button>
              </div>
            </div>
          </>
        ) : null}

        {(phase === 'creating_session' || phase === 'generating_prompt') ? (
          <div className={cn('p-6', cardBase)}>
            <p className={bodyText}>{'\u8cea\u554f\u3092\u6e96\u5099\u3057\u3066\u3044\u307e\u3059...'}</p>
          </div>
        ) : null}

        {(phase === 'answering' || phase === 'saving_attempt' || phase === 'evaluating') ? (
          <div className="space-y-6">
            <div className={cn('p-6', cardBase)}>
              {showCueCard ? (
                <>
                  <h2 className={cn(sectionTitle, 'mb-2 text-subsection-title')}>Cue Card</h2>
                  {cueCard?.topic ? <p className="mb-3 text-lg font-semibold text-text">{cueCard.topic}</p> : null}
                  {Array.isArray(cueCard?.points) && cueCard.points.length > 0 ? (
                    <ul className="list-inside list-disc space-y-1 text-text leading-relaxed">
                      {cueCard.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <>
                  <h2 className={cn(sectionTitle, 'mb-2 text-subsection-title')}>{'\u8cea\u554f'}</h2>
                  <p className="text-lg leading-relaxed text-text">{questionText}</p>
                </>
              )}
            </div>

            <div className={cn('p-6', cardBase)}>
              <label className="mb-2 block text-sm font-semibold text-text">{'\u3042\u306a\u305f\u306e\u56de\u7b54'}</label>
              <div className="mb-4 space-y-3 rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={!canRecordAudio || voiceInputState !== 'idle' || phase !== 'answering'}
                    className={buttonSecondary}
                  >
                    {voiceInputState === 'recording' ? '\u9332\u97f3\u4e2d...' : '\u9332\u97f3\u3092\u59cb\u3081\u308b'}
                  </button>
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    disabled={voiceInputState !== 'recording'}
                    className={buttonSecondary}
                  >
                    {'\u9332\u97f3\u3092\u505c\u6b62'}
                  </button>
                </div>
                <p className={helperText}>
                  {canRecordAudio
                    ? voiceInputState === 'transcribing'
                      ? '\u6587\u5b57\u8d77\u3053\u3057\u4e2d\u3067\u3059...'
                      : '\u9332\u97f3\u2192\u6587\u5b57\u8d77\u3053\u3057\u3067 textarea \u306b\u53cd\u6620\u3057\u307e\u3059\u3002\u53cd\u6620\u5f8c\u306f\u7de8\u96c6\u3057\u3066\u304b\u3089\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002'
                    : '\u3053\u306e\u30d6\u30e9\u30a6\u30b6\u3067\u306f\u97f3\u58f0\u5165\u529b\u304c\u4f7f\u3048\u307e\u305b\u3093\u3002\u30c6\u30ad\u30b9\u30c8\u56de\u7b54\u3067\u7d9a\u3051\u3066\u304f\u3060\u3055\u3044\u3002'}
                </p>
                {voiceNotice ? <p className="text-sm text-primary">{voiceNotice}</p> : null}
                {voiceErrorMessage ? <p className="text-sm text-amber-600">{voiceErrorMessage}</p> : null}
                {lastTranscript ? (
                  <p className={cn(helperText, 'text-xs')}>
                    {'\u6700\u65b0\u306e\u6587\u5b57\u8d77\u3053\u3057: '}
                    {lastTranscript}
                  </p>
                ) : null}
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={phase !== 'answering'}
                placeholder={`\u56de\u7b54\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\uff08${MIN_ANSWER_LENGTH} \u6587\u5b57\u4ee5\u4e0a\uff09`}
                className={cn(textareaBase, 'min-h-[120px]')}
                rows={5}
              />
              <p className={cn(helperText, 'mt-2 text-xs')}>
                {answer.trim().length}
                {' \u6587\u5b57 / \u6700\u4f4e '}
                {MIN_ANSWER_LENGTH}
                {' \u6587\u5b57'}
              </p>
              <button type="button" onClick={handleSubmitAnswer} disabled={isLoading || voiceInputState === 'transcribing' || answer.trim().length < MIN_ANSWER_LENGTH} className={cn('mt-4', buttonPrimary)}>
                {phase === 'saving_attempt' || phase === 'evaluating' ? '\u9001\u4fe1\u4e2d...' : '\u56de\u7b54\u3092\u9001\u4fe1\u3059\u308b'}
              </button>
              {errorMessage ? <p className="mt-3 text-sm text-amber-600">{errorMessage}</p> : null}
            </div>
          </div>
        ) : null}

        {phase === 'done' && feedbackRow ? (
          <div className="space-y-6">
            <div className={cn('p-6', cardBase)}>
              <h2 className={cn(sectionTitle, 'mb-4 text-subsection-title')}>{'\u8a55\u4fa1'}</h2>
              {feedbackRow.overall_band != null ? (
                <div className="mb-4">
                  <span className="text-sm font-semibold text-text-muted">{'\u7dcf\u5408 Band: '}</span>
                  <span className="text-xl font-bold text-text">{String(feedbackRow.overall_band)}</span>
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(EVALUATION_LABELS).map(([key, label]) => {
                  const value = feedbackRow[key];
                  if (value == null) return null;
                  return (
                    <div key={key} className="rounded-lg border border-border bg-surface-2 p-3">
                      <div className="text-xs font-semibold uppercase text-text-muted">{label}</div>
                      <div className="font-semibold text-text">{String(value)}</div>
                      {typeof feedbackRow.evidence === 'object' && feedbackRow.evidence !== null && (feedbackRow.evidence as Record<string, unknown>)[key.replace('_band', '')] != null ? (
                        <p className="mt-1 text-sm text-text-muted">
                          {String((feedbackRow.evidence as Record<string, unknown>)[key.replace('_band', '')])}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {Array.isArray(feedbackRow.top_fixes) && feedbackRow.top_fixes.length > 0 ? (
                <div className="mt-4">
                  <h3 className={cardTitle}>{'\u512a\u5148\u3057\u3066\u76f4\u3057\u305f\u3044\u30dd\u30a4\u30f3\u30c8'}</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-muted">
                    {(feedbackRow.top_fixes as Array<{ issue?: string; suggestion?: string }>)
                      .slice(0, 3)
                      .map((fix, index) => (
                        <li key={index}>{fix.issue ?? fix.suggestion ?? JSON.stringify(fix)}</li>
                      ))}
                  </ul>
                </div>
              ) : null}
              {typeof promptRow?.model_answer === 'string' && promptRow.model_answer.trim() ? (
                <div className="mt-4">
                  <h3 className={cardTitle}>{'\u6a21\u7bc4\u89e3\u7b54'}</h3>
                  <p className={cn(bodyText, 'mt-2 whitespace-pre-wrap')}>
                    {promptRow.model_answer.trim()}
                  </p>
                </div>
              ) : null}
              {typeof feedbackRow.rewrite === 'string' && feedbackRow.rewrite.trim() ? (
                <div className="mt-4">
                  <h3 className={cardTitle}>{'\u3042\u306a\u305f\u306e\u56de\u7b54\u306e\u6539\u5584\u7248'}</h3>
                  <p className={cn(bodyText, 'mt-2 whitespace-pre-wrap')}>
                    {feedbackRow.rewrite.trim()}
                  </p>
                </div>
              ) : null}
              {Array.isArray(feedbackRow.micro_drills) && feedbackRow.micro_drills.length > 0 ? (
                <div className="mt-4">
                  <h3 className={cardTitle}>{'\u6b21\u56de\u305d\u306e\u307e\u307e\u4f7f\u3048\u308b\u30d5\u30ec\u30fc\u30ba'}</h3>
                  <div className="mt-2 space-y-3">
                    {(feedbackRow.micro_drills as Array<{ jp_intent?: string; model_answer?: string }>)
                      .slice(0, 2)
                      .map((drill, index) => (
                        <div key={index} className="rounded-lg border border-border bg-surface-2 p-3">
                          {drill.jp_intent ? (
                            <p className={cn(helperText, 'mb-1')}>{drill.jp_intent}</p>
                          ) : null}
                          {drill.model_answer ? (
                            <p className={cn(bodyText, 'whitespace-pre-wrap')}>{drill.model_answer}</p>
                          ) : null}
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleTryAnother} className={buttonPrimary}>
                {'\u5225\u306e\u8cea\u554f\u3067\u7d9a\u3051\u308b'}
              </button>
              {attemptId ? (
                <Link href={`/speaking/feedback/${attemptId}`} className={cn(buttonSecondary, 'inline-flex items-center')}>
                  {'\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u8a73\u7d30\u3092\u898b\u308b'}
                </Link>
              ) : null}
              <Link href="/progress" className={cn(buttonSecondary, 'inline-flex items-center')}>
                {'\u9032\u6357\u3092\u898b\u308b'}
              </Link>
              <Link href="/home" className={cn(buttonSecondary, 'inline-flex items-center')}>
                {'\u5b66\u7fd2\u30db\u30fc\u30e0\u3078\u623b\u308b'}
              </Link>
            </div>
          </div>
        ) : null}

        {phase === 'idle' ? (
          <p className={cn(helperText, 'mt-6')}>
            <Link href="/home" className="font-medium text-primary hover:underline">
              {'\u5b66\u7fd2\u30db\u30fc\u30e0\u306b\u623b\u308b'}
            </Link>
          </p>
        ) : null}
      </div>
    </Layout>
  );
}
