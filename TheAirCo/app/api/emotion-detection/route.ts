import { type NextRequest, NextResponse } from "next/server"

const emotions = [
  "happy",
  "sad",
  "angry",
  "surprised",
  "fearful",
  "disgusted",
  "neutral",
  "focused",
  "stressed",
  "tired",
]

export async function POST(request: NextRequest) {
  try {
    const { faceRegion, employeeId } = await request.json()

    // Simulate emotion detection processing
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock emotion detection results
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = 0.7 + Math.random() * 0.3

    // Create emotion distribution
    const emotionScores = emotions.reduce(
      (acc, emotion) => {
        acc[emotion] = emotion === detectedEmotion ? confidence : Math.random() * 0.3
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      primaryEmotion: detectedEmotion,
      confidence,
      emotionScores,
      employeeId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Emotion detection failed" }, { status: 500 })
  }
}
