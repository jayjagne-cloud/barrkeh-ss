import { generateText } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  const { prompt, style, size } = await req.json()

  const enhancedPrompt = `Create a professional marketing image: ${prompt}. 
Style: ${style || "modern, clean, professional"}. 
The image should be high-quality, visually appealing, and suitable for social media marketing.
No text in the image unless specifically requested.`

  try {
    const result = await generateText({
      model: "google/gemini-3-pro-image-preview",
      prompt: enhancedPrompt,
    })

    const images = []
    for (const file of result.files) {
      if (file.mediaType.startsWith("image/")) {
        images.push({
          base64: file.base64,
          mediaType: file.mediaType,
        })
      }
    }

    return Response.json({
      success: true,
      images,
      text: result.text,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to generate image",
      },
      { status: 500 },
    )
  }
}
