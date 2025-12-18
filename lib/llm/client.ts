/**
 * LLM呼び出し共通関数
 * 複数のLLMプロバイダーに対応（OpenAI / Groq / Gemini / Hugging Face）
 */

type LLMProvider = 'openai' | 'groq' | 'gemini' | 'huggingface';

interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature: number;
  max_tokens: number;
}

// 環境変数からプロバイダーを取得（デフォルト: groq = 無料）
const getProvider = (): LLMProvider => {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  if (provider === 'openai' || provider === 'groq' || provider === 'gemini' || provider === 'huggingface') {
    return provider;
  }
  // デフォルトはgroq（無料）
  return 'groq';
};

// プロバイダーごとのデフォルトモデル
const getDefaultModel = (provider: LLMProvider): string => {
  switch (provider) {
    case 'groq':
      return process.env.LLM_MODEL || 'llama-3.1-8b-instant';
    case 'gemini':
      return process.env.LLM_MODEL || 'gemini-pro';
    case 'huggingface':
      return process.env.LLM_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
    case 'openai':
      return process.env.LLM_MODEL || 'gpt-4o-mini';
    default:
      return 'llama-3.1-8b-instant';
  }
};

const DEFAULT_CONFIG: LLMConfig = {
  provider: getProvider(),
  model: getDefaultModel(getProvider()),
  temperature: 0.7,
  max_tokens: 2000,
};

export async function callLLM(
  prompt: string,
  options?: {
    response_format?: { type: 'json_object' };
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const config = { ...DEFAULT_CONFIG, ...options };
  const apiKey = process.env.LLM_API_KEY;
  
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  // Groq API呼び出し（無料、推奨）
  if (config.provider === 'groq') {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: config.response_format,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // OpenAI API呼び出し
  if (config.provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: config.response_format,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Google Gemini API呼び出し
  if (config.provider === 'gemini') {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt + (config.response_format ? '\n\n重要: レスポンスは必ずJSON形式で返してください。' : ''),
          }],
        }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.max_tokens,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Hugging Face Inference API呼び出し
  if (config.provider === 'huggingface') {
    const response = await fetch(`https://api-inference.huggingface.co/models/${config.model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt + (config.response_format ? '\n\n重要: レスポンスは必ずJSON形式で返してください。' : ''),
        parameters: {
          temperature: config.temperature,
          max_new_tokens: config.max_tokens,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Hugging Face API error: ${error.error || 'Unknown error'}`);
    }

    const data = await response.json();
    // Hugging Faceのレスポンス形式に応じて調整
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    if (typeof data === 'string') {
      return data;
    }
    throw new Error('Unexpected Hugging Face API response format');
  }

  throw new Error(`Unsupported provider: ${config.provider}`);
}

