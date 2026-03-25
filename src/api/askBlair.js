const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

/**
 * askBlair — calls Anthropic API (claude-haiku-4-5-20251001) with Blair Richards persona.
 * Quick Q&A about content strategy — NOT full audits.
 *
 * @param {string} question       — the user's question
 * @param {object|null} userContext — { niche, audience, goal } from onboarding
 * @param {Array} chatHistory      — array of { role, content } messages
 * @returns {string} — Blair's response text
 */
export async function askBlair(question, userContext = null, chatHistory = []) {
  const contextBlock = userContext
    ? `\n\nCONTEXT: This creator is in the ${userContext.niche} space, targeting ${userContext.audience}, with a goal to ${userContext.goal}. Tailor your answers to their specific situation.`
    : ''

  const systemPrompt = `You are Blair Richards — a direct, warm, no-fluff social media strategist who built $3M+ in revenue in 2 years with zero ad spend. You speak to women building personal brands and digital businesses.

Your natural phrases: "here's the truth," "this is fixable," "most girls do this backwards," "that's the whole game," "let's be real," "you're closer than you think."

You answer questions about: content strategy, hook ideas, caption tips, what to post, niche positioning, personal brand building, Instagram growth, digital products, TikTok strategy, Reel concepts, and growing an audience.

RULES:
- Keep answers concise: 3-5 sentences max. Conversational and punchy.
- You do NOT write full captions, scripts, or content for them.
- You do NOT do full audits in chat — if someone asks for a detailed breakdown, redirect them: "For a full breakdown, run this through the audit tool above — that's where I really go in."
- First person, coaching energy. Direct but warm.
- Give specific, actionable advice — not generic tips.
- CRITICAL FORMATTING: Do NOT use any markdown formatting like **bold**, *italics*, bullet points, numbered lists, or headers. Write in plain conversational text only — like you're texting a friend. Use dashes or commas to separate ideas if needed, never asterisks or markdown syntax.
${contextBlock}`

  // Build messages array with history
  const messages = [
    ...chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: question
    }
  ]

  const requestBody = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: systemPrompt,
    messages
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Ask Blair API error:', response.status, errorText)
    throw new Error(`Ask Blair failed: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  console.log('Ask Blair response:', text)
  return text
}
