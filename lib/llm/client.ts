/**
 * LLM呼び出し共通関数
 * OpenAI API または Anthropic API に対応
 */

interface LLMConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature: number;
  max_tokens: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'openai',
  model: process.env.LLM_MODEL || 'gpt-4o-mini', // コスト効率重視
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

  // OpenAI API呼び出し
  if (config.provider === 'openai') {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      throw new Error('LLM_API_KEY is not set');
    }

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

  // Anthropic API呼び出し（将来対応）
  throw new Error('Unsupported provider');
}

