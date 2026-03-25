import rubric from '../data/rubric.js'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

/**
 * runAudit — calls Anthropic API (claude-sonnet-4-6) with Blair Richards persona.
 *
 * @param {string} auditType     — one of: bio, caption, hook, profile, concept, video_script
 * @param {string} userInput     — the text content to audit
 * @param {string|null} imageBase64 — base64-encoded image (for profile audits)
 * @param {object|null} userContext — { niche, audience, goal } from onboarding
 * @returns {object} — { overall_score, category_scores, letter_grade, summary, action_items }
 */
export async function runAudit(auditType, userInput, imageBase64 = null, userContext = null) {
  const rubricSection = rubric[auditType]
  if (!rubricSection) {
    throw new Error(`Unknown audit type: ${auditType}`)
  }

  // Build the rubric injection string
  const rubricText = rubricSection.criteria.map((c, i) => {
    return `${i + 1}. ${c.name}: ${c.description}
   - Strong (17-20): ${c.tiers.strong.description}
   - Average (10-16): ${c.tiers.average.description}
   - Weak (0-9): ${c.tiers.weak.description}`
  }).join('\n\n')

  // Build user context injection
  const contextBlock = userContext
    ? `\n\nIMPORTANT CONTEXT: This creator is in the ${userContext.niche} space, targeting ${userContext.audience}, with a goal to ${userContext.goal}. Make your feedback specific to this context. Reference their niche in at least one action item. Tailor your language to their specific industry and audience.`
    : ''

  // Bio specific instruction
  const bioNote = auditType === 'bio'
    ? `\n\nNOTE: This is an INSTAGRAM BIO REVIEW. You are evaluating the bio text — the name line, tagline, description, and CTA. Evaluate clarity of positioning, value proposition, call to action, personality/voice, and formatting/structure. This is the single most important piece of real estate on their profile — treat it that way. Be specific about what to change and exactly how to rewrite weak lines.`
    : ''

  // Video script specific instruction
  const videoScriptNote = auditType === 'video_script'
    ? `\n\nNOTE: This is a PRE-FILM SCRIPT REVIEW. You are evaluating the script/concept text alone — not a finished video. Evaluate hook strength, pacing, clarity of message, call to action, and scroll-stopping potential based on the script text. Make clear in your feedback that this is a pre-film review and give direction on how to execute it when filming.`
    : ''

  const systemPrompt = `You are Blair Richards — a direct, warm, no-fluff social media strategist who built $3M+ in revenue in 2 years with zero ad spend. You speak to women building personal brands and digital businesses. You have coaching call energy — encouraging but you never sugarcoat. You are known for the BE RICH brand and for helping women build profitable personal brands online.

Your natural phrases include: "here's the truth," "this is fixable," "most girls do this backwards," "that's the whole game," "let's be real," "I'm not going to sugarcoat this," "this is what separates the girls who grow from the ones who stay stuck," "you're closer than you think," "the algorithm isn't the problem — your content is," "stop making content for everyone and start making it for her," "the feed doesn't lie," "your audience is telling you what they want — you just have to listen," "this is giving main character energy," "I've seen this a thousand times and I know exactly what's going on," "the money follows the message," "people don't follow for information — they follow for transformation," "you're not boring, your content strategy is," "stop posting and praying," "clarity converts," "the girlies who win are the ones who keep showing up."

IMPORTANT — Vary your opening line for the summary every time. Do NOT start with the same phrase. Choose a different natural opening based on the quality of the content — surprise, disappointment, encouragement, directness, etc. Examples: "Okay let me break this down for you." / "Alright, I have thoughts." / "So here's what I'm seeing." / "First impression? Let me be honest." / "I can tell you put thought into this — here's where we take it further." / "Real talk — this needs work but I see the potential." / "This is solid but we're leaving points on the table."

You are auditing a piece of content: ${rubricSection.label}.
${rubricSection.description}

SCORING RUBRIC — evaluate against these 5 criteria, scoring each 0-20:

${rubricText}
${contextBlock}
${bioNote}
${videoScriptNote}

INSTRUCTIONS:
- Score honestly. Most content should land in the 45-75 range. Reserve 85+ for genuinely excellent content.
- Be specific in your action items — reference exact lines or elements from their content.
- Write in first person as Blair. Coaching energy. Direct but warm.
- Vary your opening line — don't always start the same way.
- Always end the summary with energy — leave them motivated.
- If user context is provided, make at least one action item specifically reference their niche or audience.
- Each action item should be specific and actionable, not generic advice. Reference their actual content.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text. The "action_items" field MUST be a JSON array of 5 strings — do NOT use unescaped quotes or apostrophes inside strings (use unicode \\u0027 for apostrophes if needed). Use this exact format:
{
  "overall_score": <number 0-100>,
  "category_scores": {
    "${rubricSection.criteria[0].name}": <number 0-20>,
    "${rubricSection.criteria[1].name}": <number 0-20>,
    "${rubricSection.criteria[2].name}": <number 0-20>,
    "${rubricSection.criteria[3].name}": <number 0-20>,
    "${rubricSection.criteria[4].name}": <number 0-20>
  },
  "letter_grade": "<A|B|C|D|F>",
  "summary": "<2-3 sentences in Blair's voice summarizing the audit. Vary the opening line.>",
  "action_items": [
    "<specific fix #1 in Blair's voice, first person>",
    "<specific fix #2 in Blair's voice, first person>",
    "<specific fix #3 in Blair's voice, first person>",
    "<specific fix #4 in Blair's voice, first person>",
    "<specific fix #5 in Blair's voice, first person>"
  ]
}`

  // Build the user message content
  const userContent = []

  if (imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: imageBase64
      }
    })
  }

  if (userInput) {
    userContent.push({
      type: 'text',
      text: `Here is the content to audit:\n\n${userInput}`
    })
  } else if (imageBase64) {
    userContent.push({
      type: 'text',
      text: 'Please audit this profile screenshot.'
    })
  }

  const requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userContent
      }
    ]
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
    console.error('Audit API error:', response.status, errorText)
    throw new Error(`Audit failed: ${response.status} — ${errorText}`)
  }

  const data = await response.json()

  // Extract the text content from the response
  const rawText = data.content?.[0]?.text || ''
  console.log('Raw audit response:', rawText)

  // Parse JSON from the response — handle malformed action_items gracefully
  try {
    let jsonStr = rawText
    // Try to extract JSON if there's any extra text around it
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    jsonStr = jsonMatch[0]

    let result
    try {
      result = JSON.parse(jsonStr)
    } catch (firstParseError) {
      // Common issue: action_items comes as separate strings instead of an array
      const actionItemsMatch = jsonStr.match(/"action_items"\s*:\s*\[?([\s\S]*?)\]?\s*\}$/)
      if (actionItemsMatch) {
        const beforeAI = jsonStr.substring(0, jsonStr.indexOf('"action_items"'))
        const aiRaw = actionItemsMatch[1]
        const items = []
        const itemMatches = aiRaw.match(/"([^"]*(?:\\.[^"]*)*)"/g)
        if (itemMatches) {
          itemMatches.forEach(m => {
            const clean = m.slice(1, -1)
            if (clean.length > 10) items.push(clean)
          })
        }
        if (items.length >= 3) {
          const fixedJson = beforeAI + '"action_items":' + JSON.stringify(items.slice(0, 5)) + '}'
          result = JSON.parse(fixedJson)
        } else {
          throw firstParseError
        }
      } else {
        throw firstParseError
      }
    }

    // If action_items is a string instead of array, split it
    if (typeof result.action_items === 'string') {
      result.action_items = result.action_items
        .split(/\d+\.\s+/)
        .filter(s => s.trim().length > 10)
        .slice(0, 5)
      if (result.action_items.length === 0) {
        result.action_items = [result.action_items]
      }
    }

    // Ensure action_items is an array
    if (!Array.isArray(result.action_items)) {
      result.action_items = [String(result.action_items)]
    }

    // Ensure exactly 5 action items (pad or trim)
    while (result.action_items.length < 5) {
      result.action_items.push('Review this area and identify one specific improvement you can make today.')
    }
    result.action_items = result.action_items.slice(0, 5)

    // Validate required fields
    if (
      typeof result.overall_score !== 'number' ||
      !result.category_scores ||
      !result.letter_grade ||
      !result.summary
    ) {
      throw new Error('Response missing required fields')
    }

    console.log('Parsed audit result:', result)
    return result
  } catch (parseError) {
    console.error('Failed to parse audit response:', parseError, rawText)
    throw new Error('Blair had trouble formatting her response. Please try again.')
  }
}
