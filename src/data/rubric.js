/**
 * Blair AI — Audit Rubric
 *
 * 5 audit types, each with 5 criteria.
 * Each criterion has name, description, and three scoring tiers:
 *   strong (17-20), average (10-16), weak (0-9)
 *
 * Placeholder rubric using best-practice assumptions.
 * Blair's real course content replaces this in Session 7.
 */

const rubric = {
  caption: {
    id: 'caption',
    label: 'Instagram Caption',
    description: 'Audit your Instagram caption for engagement, clarity, and conversion.',
    criteria: [
      {
        name: 'Hook Strength',
        description: 'Does the first line stop the scroll and create curiosity?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'First line is irresistible — creates a pattern interrupt, asks a provocative question, or makes a bold claim that demands the reader keep going.'
          },
          average: {
            range: [10, 16],
            description: 'First line is decent but generic — could belong to anyone. Doesn\'t create urgency or strong curiosity.'
          },
          weak: {
            range: [0, 9],
            description: 'No hook at all — starts with filler, context, or a statement that gives the reader zero reason to keep reading.'
          }
        }
      },
      {
        name: 'Value Delivery',
        description: 'Does the caption teach, inspire, or give the reader something actionable?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Delivers a clear takeaway — the reader walks away with a mindset shift, a framework, or a specific action step they can use immediately.'
          },
          average: {
            range: [10, 16],
            description: 'Some value present but surface-level — tells rather than shows. Reader gets the idea but not the depth.'
          },
          weak: {
            range: [0, 9],
            description: 'No clear value — reads like a journal entry or vague motivation with no actionable insight.'
          }
        }
      },
      {
        name: 'Voice & Personality',
        description: 'Does this sound like a real person with a distinct brand voice?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Unmistakably branded — you could remove the handle and still know who wrote it. Conversational, confident, and distinctly theirs.'
          },
          average: {
            range: [10, 16],
            description: 'Sounds fine but interchangeable — could be any creator in the niche. Lacks signature phrases or distinct perspective.'
          },
          weak: {
            range: [0, 9],
            description: 'Robotic, generic, or AI-sounding — no personality, no warmth, no reason to follow this person specifically.'
          }
        }
      },
      {
        name: 'Call to Action',
        description: 'Does the caption drive a specific next step — save, share, comment, click?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Clear, natural CTA that feels like a conversation, not a command. Gives the reader a reason to engage beyond "double tap if you agree."'
          },
          average: {
            range: [10, 16],
            description: 'CTA exists but feels tacked on or generic — "comment below" or "save this" without context for why.'
          },
          weak: {
            range: [0, 9],
            description: 'No CTA at all — the caption just ends. Reader has no reason to do anything after reading.'
          }
        }
      },
      {
        name: 'Structure & Readability',
        description: 'Is the caption visually scannable and well-formatted for mobile?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Short paragraphs, line breaks, easy to skim. Uses formatting intentionally — white space, emphasis, lists — to guide the eye.'
          },
          average: {
            range: [10, 16],
            description: 'Somewhat readable but dense in spots. Could benefit from better paragraph breaks or visual hierarchy.'
          },
          weak: {
            range: [0, 9],
            description: 'Wall of text — no line breaks, no structure. Impossible to skim on mobile, so most people won\'t even try.'
          }
        }
      }
    ]
  },

  hook: {
    id: 'hook',
    label: 'Hook (Reel/TikTok opener)',
    description: 'Audit your Reel or TikTok hook for scroll-stopping power.',
    criteria: [
      {
        name: 'Pattern Interrupt',
        description: 'Does the opening break the scroll pattern in the first 1-2 seconds?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Immediately disrupts — uses a bold statement, unexpected visual, direct address, or tension that forces the viewer to pause.'
          },
          average: {
            range: [10, 16],
            description: 'Gets attention but not urgently — the viewer might keep scrolling if something better comes along.'
          },
          weak: {
            range: [0, 9],
            description: 'No pattern interrupt — opens with a slow intro, no text overlay, or context that takes too long to land.'
          }
        }
      },
      {
        name: 'Curiosity Gap',
        description: 'Does the hook create a question the viewer needs answered?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Creates an irresistible open loop — the viewer literally cannot swipe away without knowing what comes next.'
          },
          average: {
            range: [10, 16],
            description: 'Some curiosity but predictable — the viewer can guess where it\'s going, so there\'s less reason to stay.'
          },
          weak: {
            range: [0, 9],
            description: 'No curiosity at all — the hook gives everything away or is too vague to care about.'
          }
        }
      },
      {
        name: 'Target Audience Clarity',
        description: 'Does the hook instantly signal who this content is for?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'The ideal viewer immediately thinks "this is for me" — uses specific language, scenarios, or pain points that filter the audience.'
          },
          average: {
            range: [10, 16],
            description: 'Somewhat relevant to the target but could apply to almost anyone. Not specific enough to feel personal.'
          },
          weak: {
            range: [0, 9],
            description: 'No audience targeting — generic hook that doesn\'t speak to any specific person or problem.'
          }
        }
      },
      {
        name: 'Emotional Trigger',
        description: 'Does the hook activate an emotion — fear, desire, frustration, excitement?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Hits a nerve instantly — the viewer feels seen, called out, or excited within the first line. Emotional engagement is immediate.'
          },
          average: {
            range: [10, 16],
            description: 'Lightly emotional but not visceral — the viewer understands the concept but doesn\'t feel it in their gut.'
          },
          weak: {
            range: [0, 9],
            description: 'Flat and emotionless — informational tone with no feeling behind it. Could be a Wikipedia article intro.'
          }
        }
      },
      {
        name: 'Conciseness',
        description: 'Is the hook tight — no wasted words, maximum impact per syllable?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Every single word earns its place. Short, punchy, impossible to trim further without losing meaning.'
          },
          average: {
            range: [10, 16],
            description: 'Decent but wordy — could be tightened by 30-40% and hit harder.'
          },
          weak: {
            range: [0, 9],
            description: 'Way too long for a hook — rambles, uses filler words, or takes 10 seconds to say what should take 3.'
          }
        }
      }
    ]
  },

  profile: {
    id: 'profile',
    label: 'Profile Grid (screenshot)',
    description: 'Audit your Instagram profile grid for brand clarity and first-impression impact.',
    criteria: [
      {
        name: 'Bio Clarity',
        description: 'Does the bio instantly communicate who you are, who you help, and why they should follow?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Crystal clear in under 3 seconds — niche, audience, and value prop are immediately obvious. Uses line breaks and formatting intentionally.'
          },
          average: {
            range: [10, 16],
            description: 'Gives a general idea but requires effort to understand. Missing a clear value prop or audience identifier.'
          },
          weak: {
            range: [0, 9],
            description: 'Confusing, vague, or cluttered — a new visitor has no idea what this person does or why they should follow.'
          }
        }
      },
      {
        name: 'Visual Cohesion',
        description: 'Does the grid feel intentional — consistent colors, style, and brand aesthetic?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'The grid looks curated and branded — consistent color palette, font style on graphics, and a clear visual identity that feels premium.'
          },
          average: {
            range: [10, 16],
            description: 'Some consistency but inconsistent — a few posts feel off-brand or the color palette shifts noticeably.'
          },
          weak: {
            range: [0, 9],
            description: 'No visual cohesion — random colors, styles, and formats. Looks like 9 different accounts posted here.'
          }
        }
      },
      {
        name: 'Content Mix',
        description: 'Is there a healthy balance of content types — value, personality, proof, CTA?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Smart mix of educational, personal, social proof, and promotional content. A new visitor sees range and depth immediately.'
          },
          average: {
            range: [10, 16],
            description: 'Leans too heavily into one type — all value posts, all selfies, or all quotes. Missing variety.'
          },
          weak: {
            range: [0, 9],
            description: 'All one type of content or no clear strategy at all — random posts with no intentional mix.'
          }
        }
      },
      {
        name: 'Highlight Covers & Organization',
        description: 'Are story highlights organized, branded, and useful for a first-time visitor?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Highlights act as a mini-website — branded covers, clear labels, strategic categories (About, Testimonials, Free Resources, etc.).'
          },
          average: {
            range: [10, 16],
            description: 'Highlights exist but aren\'t strategic — generic labels, inconsistent covers, or outdated content.'
          },
          weak: {
            range: [0, 9],
            description: 'No highlights, or highlights are a mess — unnamed, unbranded, or irrelevant to the brand.'
          }
        }
      },
      {
        name: 'First Impression & Follow Factor',
        description: 'If someone landed here for the first time, would they hit follow in 5 seconds?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Instant follow energy — the profile radiates authority, clarity, and value. A visitor immediately knows what they\'ll get by following.'
          },
          average: {
            range: [10, 16],
            description: 'Decent but not compelling — a visitor might follow eventually but wouldn\'t feel urgency to do so right now.'
          },
          weak: {
            range: [0, 9],
            description: 'No follow motivation — the profile doesn\'t communicate enough value or clarity to earn a follow from a cold visitor.'
          }
        }
      }
    ]
  },

  concept: {
    id: 'concept',
    label: 'Content Concept',
    description: 'Audit your content idea before you create it — is it worth making?',
    criteria: [
      {
        name: 'Shareability',
        description: 'Would someone send this to a friend or share it to their stories?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Highly shareable — makes the sharer look smart, funny, or helpful. People would tag friends or screenshot it.'
          },
          average: {
            range: [10, 16],
            description: 'Mildly shareable — good content but not "I need to send this right now" level.'
          },
          weak: {
            range: [0, 9],
            description: 'Not shareable at all — too personal, too niche, or too generic to warrant sharing.'
          }
        }
      },
      {
        name: 'Savability',
        description: 'Is this the kind of content people would save to reference later?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Extremely savable — contains a framework, checklist, list, or insight people will want to revisit. High utility.'
          },
          average: {
            range: [10, 16],
            description: 'Some save potential but not bookmark-worthy — the value isn\'t dense or specific enough to revisit.'
          },
          weak: {
            range: [0, 9],
            description: 'No save value — one-and-done content that doesn\'t offer anything worth returning to.'
          }
        }
      },
      {
        name: 'Niche Relevance',
        description: 'Does this concept directly serve the target audience\'s current problems or desires?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Laser-focused on a specific pain point or desire the target audience has right now. They\'ll feel like it was made for them.'
          },
          average: {
            range: [10, 16],
            description: 'Somewhat relevant but broad — could apply to many different audiences, not just the intended one.'
          },
          weak: {
            range: [0, 9],
            description: 'Off-target — doesn\'t connect to what the target audience actually cares about or struggles with.'
          }
        }
      },
      {
        name: 'Originality & Angle',
        description: 'Does this concept bring a fresh take, or is it recycled content?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Fresh angle — even if the topic has been covered before, the perspective, format, or framing feels new and uniquely theirs.'
          },
          average: {
            range: [10, 16],
            description: 'Decent topic but predictable angle — the viewer has probably seen a version of this from 10 other creators.'
          },
          weak: {
            range: [0, 9],
            description: 'Copy-paste energy — completely recycled concept with nothing new to offer. Feels like trend-chasing without substance.'
          }
        }
      },
      {
        name: 'Conversion Potential',
        description: 'Could this content naturally lead to a follow, a DM, or a sale?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Built with conversion in mind — positions the creator as the authority and naturally leads to the next step (follow, freebie, product).'
          },
          average: {
            range: [10, 16],
            description: 'Some conversion potential but the path from content to action isn\'t clear or intentional.'
          },
          weak: {
            range: [0, 9],
            description: 'No conversion path — entertaining maybe, but does nothing to grow the business or deepen the audience relationship.'
          }
        }
      }
    ]
  },

  video_script: {
    id: 'video_script',
    label: 'Video Script / TikTok Script',
    description: 'Pre-film script review — audit your video concept and script before you shoot.',
    criteria: [
      {
        name: 'Hook Strength (First 3 Seconds)',
        description: 'Does the opening line stop the scroll and lock in the viewer immediately?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'The first line is a scroll-stopper — bold claim, provocative question, or pattern interrupt that makes it impossible to swipe away.'
          },
          average: {
            range: [10, 16],
            description: 'Opens with some interest but doesn\'t demand attention — the viewer might stay or might not.'
          },
          weak: {
            range: [0, 9],
            description: 'Slow opener — starts with "Hey guys," context-setting, or filler that loses the viewer before the point arrives.'
          }
        }
      },
      {
        name: 'Pacing & Flow',
        description: 'Does the script move at the right speed — no dead air, no rushing?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Tight pacing — every beat serves a purpose, transitions are smooth, and the energy builds naturally to the payoff.'
          },
          average: {
            range: [10, 16],
            description: 'Decent pacing but has slow spots or feels slightly rushed in places. Could be tightened.'
          },
          weak: {
            range: [0, 9],
            description: 'Pacing is off — either painfully slow, confusingly fast, or meanders without direction.'
          }
        }
      },
      {
        name: 'Message Clarity',
        description: 'Is there one clear takeaway the viewer walks away with?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Crystal clear single message — the viewer could summarize this video in one sentence after watching.'
          },
          average: {
            range: [10, 16],
            description: 'The point is there but muddy — tries to cover too much or doesn\'t land the main message cleanly.'
          },
          weak: {
            range: [0, 9],
            description: 'No clear message — the viewer finishes and thinks "what was that about?" Multiple competing ideas, no focus.'
          }
        }
      },
      {
        name: 'Call to Action',
        description: 'Does the script end with a clear next step for the viewer?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'Strong, natural CTA that flows from the content — tells the viewer exactly what to do next and why it benefits them.'
          },
          average: {
            range: [10, 16],
            description: 'CTA exists but feels forced or generic — "follow for more" without a compelling reason.'
          },
          weak: {
            range: [0, 9],
            description: 'No CTA — the video just ends. No follow prompt, no engagement ask, no link mention. Dead end.'
          }
        }
      },
      {
        name: 'Scroll-Stopping Potential',
        description: 'Based on the script alone, would this video perform well in a feed?',
        tiers: {
          strong: {
            range: [17, 20],
            description: 'High viral potential — the concept is relatable, the hook is sharp, and the format is optimized for short-form. This video gets saved and shared.'
          },
          average: {
            range: [10, 16],
            description: 'Solid but not exceptional — will perform fine with existing audience but unlikely to break out to new viewers.'
          },
          weak: {
            range: [0, 9],
            description: 'Low performance potential — the concept doesn\'t stand out, the format isn\'t optimized for the platform, or the energy is flat.'
          }
        }
      }
    ]
  }
}

export default rubric
