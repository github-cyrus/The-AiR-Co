import { type NextRequest, NextResponse } from "next/server"

const emergencyKeywords = ["help", "emergency", "fire", "danger", "assist", "urgent", "medical"]
const voiceCommands = ["show attendance", "display heatmap", "play footage", "generate report", "check alerts"]

export async function POST(request: NextRequest) {
  try {
    const { audioData, location } = await request.json()

    // Simulate voice processing
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock voice detection results
    const isEmergency = Math.random() < 0.1 // 10% chance of emergency detection
    const isCommand = Math.random() < 0.3 // 30% chance of command detection

    if (isEmergency) {
      const keyword = emergencyKeywords[Math.floor(Math.random() * emergencyKeywords.length)]
      return NextResponse.json({
        success: true,
        type: "emergency",
        keyword,
        confidence: 0.8 + Math.random() * 0.2,
        location,
        timestamp: new Date().toISOString(),
        alert: true,
      })
    } else if (isCommand) {
      const command = voiceCommands[Math.floor(Math.random() * voiceCommands.length)]
      return NextResponse.json({
        success: true,
        type: "command",
        command,
        confidence: 0.7 + Math.random() * 0.3,
        location,
        timestamp: new Date().toISOString(),
        alert: false,
      })
    } else {
      return NextResponse.json({
        success: true,
        type: "normal",
        confidence: 0.9,
        location,
        timestamp: new Date().toISOString(),
        alert: false,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Voice detection failed" }, { status: 500 })
  }
}
