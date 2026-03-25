const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

/**
 * generateRewrite — calls Anthropic API (claude-haiku-4-5-20251001) to produce
 * a rewritten version of the user's content, focusing on the weakest-scoring category.
 *
 * @param {string} auditType      — the audit type (bio, caption, hook, etc.)
 * @param {string} originalContent — the user's original text content
 * @param {object} auditResult    — the full audit result object
 * @param {object|null} userContext — { niche, audience, goal } from onboarding
 * @returns {object} — { rewritten_content, explanation, focus_area }
 */
export async function generateRewrite(auditType, originalContent, auditResult, userContext = null) {
  // Find the weakest-scoring category
  const scores = auditResult.category_scores || {}
  let weakestCategory = ''
  let lowestScore = 21

  for (const [category, score] of Object.entries(scores)) {
    if (score < lowestScore) {
      lowestScore = score
      weakestCategory = category
    }
  }

  const contextBlock = userContext
    ? `\nThis creator is in the ${userContext.niche} space, targeting ${userContext.audience}, with a goal to ${userContext.goal}. Tailor the rewrite to their specific niche and audience.`
    : ''

  const auditTypeLabels = {
    bio: 'Instagram Bio',
    caption: 'Instagram Caption',
    hook: 'Hook (Reel/TikTok opener)',
    profile: 'Profile Grid',
    concept: 'Content Concept',
    video_script: 'Video Script / TikTok Script',
  }

  const typeLabel = auditTypeLabels[auditType] || auditType

  const systemPrompt = `You are Blair Richards — a direct, warm, no-fluff social media strategist who built $3M+ in revenue in 2 years. You speak to women building personal brands. Coaching call energy — encouraging but never sugarcoats.

You just audited someone's ${typeLabel} and they scored ${auditResult.overall_score}/100 (${auditResult.letter_grade}). Their weakest area was "${weakestCategory}" which scored ${lowestScore}/20.
${contextBlock}

Your job is to REWRITE their content — give them a better version that directly addresses the weakness in "${weakestCategory}" while keeping their voice and intent intact. This should feel like Blair sat down and rewrote it for them as a coach would.

CRITICAL: Respond with ONLY valid JSON. No markdown, no code fences:
{
  "rewritten_content": "<the full rewritten version of their content>",
  "explanation": "<2-3 sentences in Blair's voice explaining what you changed and why — reference the weak category specifically>",
  "focus_area": "${weakestCategory}"
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the original content to rewrite:\n\n${originalContent}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Rewrite API error:', response.status, errorText)
    throw new Error(`Rewrite failed: ${response.status}`)
  }

  const data = await response.json()
  const rawText = data.content?.[0]?.text || ''
  console.log('Raw rewrite response:', rawText)

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in rewrite response')
    const result = JSON.parse(jsonMatch[0])

    if (!result.rewritten_content || !result.explanation) {
      throw new Error('Rewrite response missing required fields')
    }

    return result
  } catch (parseError) {
    console.error('Failed to parse rewrite response:', parseError, rawText)
    throw new Error('Blair had trouble with the rewrite. Please try again.')
  }
}
