/**
 * 瞬間英作文用評価プロンプト（採点用）
 */

export function buildSpeakingEvaluationPrompt(
  userResponse: string,
  prompt: {
    jp_intent: string;
    model_answer?: string;
    expected_style?: string;
    time_limit?: number;
  },
  metrics: {
    word_count: number;
    wpm?: number;
    filler_count?: number;
    long_pause_count?: number;
  }
): string {
  return `You are an IELTS Speaking examiner. Evaluate the following response and provide detailed feedback.

User's Response:
${userResponse}

Prompt (Japanese Intent):
${prompt.jp_intent}

${prompt.model_answer ? `Model Answer (for reference):
${prompt.model_answer}` : ''}

${prompt.expected_style ? `Expected Style: ${prompt.expected_style}` : ''}

Response Metrics:
- Word count: ${metrics.word_count}
${metrics.wpm !== undefined ? `- Words per minute: ${metrics.wpm.toFixed(1)}` : ''}
${metrics.filler_count !== undefined ? `- Filler words (um, like, etc.): ${metrics.filler_count}` : ''}
${metrics.long_pause_count !== undefined ? `- Long pauses: ${metrics.long_pause_count}` : ''}

Evaluate the response according to IELTS Speaking criteria (0-9 scale, decimal allowed):

1. **Fluency & Coherence (FC)**
   - Fluency: smoothness, hesitation, pauses, filler words
   - Coherence: logical flow, use of discourse markers, linking words

2. **Lexical Resource (LR)**
   - Vocabulary range and accuracy
   - Use of collocations and idioms
   - Paraphrasing ability
   - Appropriate word choice

3. **Grammar Range & Accuracy (GRA)**
   - Grammar structures variety
   - Grammatical accuracy
   - Sentence complexity
   - Error frequency

4. **Pronunciation (PR)**
   - Clarity and intelligibility (based on transcription accuracy)
   - Stress and intonation patterns (if detectable from text)
   - Phonetic accuracy (if detectable from text)
   - Note: Since this is text-based, focus on what can be inferred from the text

Output JSON format:
{
  "schema_version": "1.0",
  "band_estimates": {
    "fluency": 6.5,
    "lexical": 6.0,
    "grammar": 6.0,
    "pronunciation": 6.5,
    "overall": 6.25
  },
  "evidence": {
    "fluency": "Brief comment on fluency (one sentence, e.g., 'Good flow but frequent fillers')",
    "lexical": "Brief comment on vocabulary (one sentence, e.g., 'Adequate range but some inappropriate word choices')",
    "grammar": "Brief comment on grammar (one sentence, e.g., 'Mostly accurate but lacks complex structures')",
    "pronunciation": "Brief comment on pronunciation (one sentence, based on text analysis if possible)"
  },
  "top_fixes": [
    {
      "priority": 1,
      "dimension": "fluency" | "lexical" | "grammar" | "pronunciation",
      "issue": "Specific issue description (e.g., 'Too many filler words (um, like)')",
      "suggestion": "How to improve (e.g., 'Practice pausing naturally instead of using fillers')"
    },
    {
      "priority": 2,
      "dimension": "fluency" | "lexical" | "grammar" | "pronunciation",
      "issue": "Specific issue description",
      "suggestion": "How to improve"
    },
    {
      "priority": 3,
      "dimension": "fluency" | "lexical" | "grammar" | "pronunciation",
      "issue": "Specific issue description",
      "suggestion": "How to improve"
    }
  ],
  "rewrite": "Improved version of the user's response (similar length, more natural, fixing the main issues)",
  "micro_drills": [
    {
      "jp_intent": "Japanese intent targeting the main weakness",
      "model_answer": "Model answer for the drill (natural English)"
    },
    {
      "jp_intent": "Japanese intent targeting the secondary weakness",
      "model_answer": "Model answer for the drill (natural English)"
    }
  ],
  "weakness_tags": ["vocabulary", "grammar", "collocation", "discourse", "fluency", "pronunciation"]
}

Requirements:
1. Provide honest, constructive feedback (not too harsh, not too lenient)
2. Focus on actionable improvements (what can the user do to improve?)
3. Rewrite should be natural and improve the original while maintaining similar length
4. Micro drills should target the main weaknesses identified in top_fixes
5. Use decimal bands (e.g., 6.5) for precision
6. Overall band should be the average of the 4 criteria, rounded to 0.25 increments
7. Weakness tags should reflect the main areas needing improvement (1-3 tags, max 4)`;
}

