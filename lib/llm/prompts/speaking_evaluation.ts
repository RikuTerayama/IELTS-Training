/**
 * Speaking evaluation prompt
 */

export function buildSpeakingEvaluationPrompt(
  userResponse: string,
  prompt: {
    part?: string;
    question_text?: string;
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
    has_audio_transcript?: boolean;
  }
): string {
  return `You are an IELTS Speaking examiner. Evaluate the following response and provide detailed feedback.

User's Response:
${userResponse}

${prompt.part ? `Speaking Part: ${prompt.part}` : ''}
${prompt.question_text ? `Question / Cue Card:
${prompt.question_text}` : ''}
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
${metrics.has_audio_transcript ? '- Response source: transcript generated from a recorded spoken answer' : '- Response source: typed text answer'}

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
   - If the response source is typed text, keep pronunciation comments cautious and non-committal
   - If the response source is a voice transcript, you may comment on spoken delivery in broad terms only
   - Do not claim detailed acoustic or phonetic analysis unless it is clearly supported

Output JSON format:
{
  "schema_version": "1.0",
  "band_estimates": {
    "fluency": 6.5,
    "lexical": 6.0,
    "grammar": 6.0,
    "pronunciation": 6.0,
    "overall": 6.0
  },
  "evidence": {
    "fluency": "Brief comment on fluency",
    "lexical": "Brief comment on vocabulary",
    "grammar": "Brief comment on grammar",
    "pronunciation": "Brief comment on pronunciation"
  },
  "top_fixes": [
    {
      "priority": 1,
      "dimension": "fluency",
      "issue": "Specific issue description",
      "suggestion": "How to improve"
    },
    {
      "priority": 2,
      "dimension": "lexical",
      "issue": "Specific issue description",
      "suggestion": "How to improve"
    },
    {
      "priority": 3,
      "dimension": "grammar",
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
1. Provide honest, constructive feedback.
2. Focus on actionable improvements.
3. Rewrite should be natural and improve the original while maintaining similar length.
4. Micro drills should target the main weaknesses identified in top_fixes.
5. Use decimal bands (e.g. 6.5) when helpful.
6. Overall band should roughly align with the four criteria.
7. Weakness tags should reflect the main areas needing improvement (1-4 tags).
8. Model answer should be a natural spoken response, not an essay.
9. Rewrite should stay close to the user's original idea so the learner can see what changed.`;
}