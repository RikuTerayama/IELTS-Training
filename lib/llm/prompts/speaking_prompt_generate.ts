/**
 * 瞬間英作文用プロンプト生成（出題用）
 */

export function buildSpeakingPromptGeneratePrompt(
  topic: string, // 'work', 'travel', 'food', etc.
  part: 'part1' | 'part2' | 'part3' | null, // Mockの場合
  level: 'B1' | 'B2' | 'C1',
  mode: 'drill' | 'mock',
  targetPoints?: {
    vocabulary?: string[]; // 使わせたい語彙
    grammar?: string[]; // 使わせたい構文
    discourse?: string[]; // 談話標識
  }
): string {
  const partDescription = part
    ? part === 'part1'
      ? 'Part 1 (Simple, personal questions, 10-20 seconds response)'
      : part === 'part2'
      ? 'Part 2 (Cue card with 4 bullet points, 60s prep + 120s speaking)'
      : 'Part 3 (Abstract, analytical questions, 30-60 seconds response)'
    : '';

  const targetPointsText = targetPoints
    ? `Target Points:
- Vocabulary: ${targetPoints.vocabulary?.join(', ') || 'any'}
- Grammar: ${targetPoints.grammar?.join(', ') || 'any'}
- Discourse markers: ${targetPoints.discourse?.join(', ') || 'any'}`
    : '';

  const modeInstructions =
    mode === 'drill'
      ? `For Drill mode:
- Create a Japanese "intent" that is NOT easily translatable directly
- The intent should guide the user to use natural English expressions
- Time limit: 5-12 seconds (adjust based on level: B1=5-8s, B2=8-10s, C1=10-12s)
- Focus on practical, everyday expressions`
      : `For Mock mode (${part}):
${part === 'part1' ? '- Simple, personal questions about familiar topics\n- Response time: 10-20 seconds\n- No preparation time' : ''}
${part === 'part2' ? '- Provide a cue card with 4 clear bullet points\n- Preparation time: 60 seconds\n- Speaking time: 120 seconds\n- Include a follow-up question after the main response' : ''}
${part === 'part3' ? '- Abstract, analytical questions requiring deeper thinking\n- Response time: 30-60 seconds\n- May include follow-up questions that probe deeper' : ''}`;

  return `You are an IELTS Speaking question generator for Japanese learners.

Generate a speaking prompt appropriate for the following parameters:

Mode: ${mode}
${part ? `Part: ${partDescription}` : ''}
Topic: ${topic}
Level: ${level}
- B1: Lower intermediate (Band 5.0-5.5 target)
- B2: Upper intermediate (Band 6.0-6.5 target)
- C1: Advanced (Band 6.5-7.0+ target)

${targetPointsText}

${modeInstructions}

Output JSON format:
{
  "schema_version": "1.0",
  "jp_intent": "日本語の意図（直訳しづらい表現。例: 申し訳ないが断る、柔らかく提案する、理由→例→結論で答える）",
  "expected_style": "casual" | "formal" | "polite",
  "target_points": {
    "vocabulary": ["word1", "word2"],
    "grammar": ["structure1"],
    "discourse": ["marker1"]
  },
  "model_answer": "Natural English response (appropriate for ${level} level, as reference)",
  "paraphrases": [
    "Alternative expression 1 (natural variation)",
    "Alternative expression 2 (natural variation)",
    "Alternative expression 3 (natural variation)"
  ],
  ${mode === 'mock' && part === 'part2' ? `"cue_card": {
    "topic": "Describe a place you visited recently that impressed you",
    "points": [
      "where it was",
      "when you visited it",
      "what you did there",
      "and explain why it impressed you"
    ]
  },
  ` : ''}${mode === 'mock' ? `"followup_question": "Follow-up question (if applicable for ${part})",
  ` : ''}"time_limit": ${mode === 'drill' ? (level === 'B1' ? 8 : level === 'B2' ? 10 : 12) : part === 'part1' ? 20 : part === 'part2' ? 120 : 60}
}

Requirements:
1. The Japanese intent should NOT be a direct translation - it should express the "intent" or "feeling" behind what the user wants to say
2. Guide users to use natural, idiomatic English (avoid literal translations)
3. Model answer should be appropriate for the target level (${level})
4. Provide 2-3 practical paraphrases that sound natural in English
5. ${mode === 'mock' && part === 'part2' ? 'Include a proper cue card structure with 4 clear bullet points' : ''}
6. Make the prompt engaging and relevant to everyday situations`;
}

