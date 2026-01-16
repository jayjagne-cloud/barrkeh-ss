import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, type, context } = await req.json()

  const systemPrompts: Record<string, string> = {
    hooks: `You are an expert social media marketer specializing in creating viral hooks. 
Generate 10 unique, attention-grabbing hooks for the given product/topic.
Each hook should be on its own line, numbered 1-10.
Focus on: curiosity, controversy, transformation, relatability, and urgency.
Keep hooks under 100 characters for optimal engagement.`,

    captions: `You are an expert social media copywriter. 
Generate 3 captions for the given product/topic:
1. SHORT (1-2 sentences, punchy and direct)
2. MEDIUM (3-5 sentences, storytelling element)
3. LONG (6-10 sentences, full story with features and CTA)
Label each clearly. Include relevant emojis sparingly. End with a clear CTA.`,

    ctas: `You are a conversion optimization expert.
Generate 8 unique call-to-action phrases for the given product/topic.
Mix urgency, exclusivity, curiosity, and benefit-focused CTAs.
Each CTA should be on its own line, numbered 1-8.`,

    hashtags: `You are a social media growth expert.
Generate 20 relevant hashtags for the given product/topic.
Mix: 5 high-volume (1M+ posts), 10 medium (100k-1M), 5 niche (<100k).
Output as a single block of hashtags separated by spaces.`,

    carousel: `You are a content strategist specializing in carousel posts.
Create a detailed carousel outline for the given product/topic.
Format:
Slide 1: [Hook - attention grabber]
Slide 2: [Problem/Pain point]
Slide 3-5: [Solution/Features/Benefits]
Slide 6: [Social proof or results]
Slide 7: [CTA with clear next step]
Include specific text suggestions for each slide.`,

    reel: `You are a viral video content creator.
Create a detailed reel/TikTok script for the given product/topic.
Format each scene with:
- Timestamp (0-3s, 3-6s, etc.)
- Visual description
- Text overlay
- Audio suggestion (trending sound type)
Keep total duration 15-30 seconds for optimal engagement.`,

    script: `You are a professional video scriptwriter.
Write a complete video script for the given product/topic.
Include:
- Opening hook (first 3 seconds)
- Problem statement
- Solution introduction
- Feature highlights (3-5 key points)
- Social proof mention
- Clear CTA
Format with [VISUAL] and [AUDIO] cues.`,

    suggestions: `You are a marketing strategy consultant.
Analyze the given product/topic and provide:
1. 3 content angle suggestions
2. Best posting times recommendation
3. Target audience insights
4. Trending format recommendations
5. 2 collaboration/partnership ideas
Keep responses actionable and specific.`,

    chat: `You are a helpful marketing AI assistant for Barrkeh Digiproducts.
Help users with content creation, marketing strategy, and product launches.
Be conversational, supportive, and provide actionable advice.
When suggesting content, be specific and creative.`,
  }

  const systemPrompt = systemPrompts[type] || systemPrompts.chat

  const prompt = messages
    ? convertToModelMessages(messages as UIMessage[])
    : [{ role: "user" as const, content: context || "Help me create marketing content." }]

  const result = streamText({
    model: "openai/gpt-5",
    system: systemPrompt,
    messages: prompt,
    maxOutputTokens: 2000,
    temperature: 0.8,
  })

  return result.toUIMessageStreamResponse()
}
