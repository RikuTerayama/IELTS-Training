import { createClient } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const TRANSCRIPTION_TIMEOUT_MS = 45_000;
const ALLOWED_AUDIO_TYPES = new Set([
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
]);

function normalizeMimeType(mimeType: string): string {
  return mimeType.split(';')[0].trim().toLowerCase();
}

function getAudioExtension(mimeType: string): string {
  const normalized = normalizeMimeType(mimeType);
  if (normalized === 'audio/mp4') return 'm4a';
  if (normalized === 'audio/ogg') return 'ogg';
  if (normalized === 'audio/mpeg' || normalized === 'audio/mp3') return 'mp3';
  if (normalized === 'audio/wav' || normalized === 'audio/x-wav' || normalized === 'audio/wave') return 'wav';
  return 'webm';
}

function getTranscriptionApiKey(): string | null {
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiApiKey) return openAiApiKey;

  if (process.env.LLM_PROVIDER?.toLowerCase() === 'openai' && process.env.LLM_API_KEY?.trim()) {
    return process.env.LLM_API_KEY.trim();
  }

  return null;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), { status: 401 });
    }

    const apiKey = getTranscriptionApiKey();
    if (!apiKey) {
      return Response.json(
        errorResponse('SERVICE_UNAVAILABLE', 'Speech transcription is not configured'),
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!(audioFile instanceof File)) {
      return Response.json(errorResponse('BAD_REQUEST', 'Audio file is required'), { status: 400 });
    }

    if (audioFile.size <= 0) {
      return Response.json(errorResponse('BAD_REQUEST', 'Audio file is empty'), { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_BYTES) {
      return Response.json(errorResponse('PAYLOAD_TOO_LARGE', 'Audio file is too large'), { status: 413 });
    }

    const normalizedMimeType = normalizeMimeType(audioFile.type || 'audio/webm');
    if (!ALLOWED_AUDIO_TYPES.has(normalizedMimeType)) {
      return Response.json(
        errorResponse('UNSUPPORTED_MEDIA_TYPE', 'Unsupported audio format'),
        { status: 415 }
      );
    }

    const upstreamFormData = new FormData();
    upstreamFormData.append(
      'file',
      new File([audioFile], `speaking-answer.${getAudioExtension(normalizedMimeType)}`, {
        type: normalizedMimeType,
      })
    );
    upstreamFormData.append(
      'model',
      process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || 'gpt-4o-mini-transcribe'
    );
    upstreamFormData.append('language', 'en');
    upstreamFormData.append('response_format', 'json');
    upstreamFormData.append(
      'prompt',
      'This is an IELTS Speaking answer in English. Return only the transcription.'
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TRANSCRIPTION_TIMEOUT_MS);

    try {
      const upstreamResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: upstreamFormData,
        signal: controller.signal,
      });

      if (!upstreamResponse.ok) {
        const upstreamText = await upstreamResponse.text().catch(() => '');
        console.error('[Speaking Transcriptions API] Upstream error:', upstreamResponse.status, upstreamText);
        return Response.json(
          errorResponse('TRANSCRIPTION_FAILED', 'Failed to transcribe audio'),
          { status: upstreamResponse.status >= 500 ? 502 : 400 }
        );
      }

      const upstreamData = (await upstreamResponse.json().catch(() => null)) as
        | { text?: string }
        | null;
      const transcript = typeof upstreamData?.text === 'string' ? upstreamData.text.trim() : '';

      if (!transcript) {
        return Response.json(
          errorResponse('TRANSCRIPTION_FAILED', 'No transcript was returned'),
          { status: 502 }
        );
      }

      return Response.json(successResponse({ transcript }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return Response.json(errorResponse('UPSTREAM_TIMEOUT', 'Transcription request timed out'), {
          status: 504,
        });
      }

      console.error('[Speaking Transcriptions API] Unexpected upstream error:', error);
      return Response.json(
        errorResponse('TRANSCRIPTION_FAILED', 'Failed to transcribe audio'),
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('[Speaking Transcriptions API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unexpected error'),
      { status: 500 }
    );
  }
}