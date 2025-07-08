import { type NextRequest, NextResponse } from "next/server"

// Mock face detection API endpoint
export async function POST(request: NextRequest) {
  try {
    const { imageData, cameraId } = await request.json()

    // Simulate face detection processing
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock detected faces
    const detectedFaces = [
      {
        id: "face_1",
        boundingBox: { x: 100, y: 50, width: 80, height: 100 },
        confidence: 0.98,
        embedding: "mock_face_embedding_1",
      },
      {
        id: "face_2",
        boundingBox: { x: 300, y: 80, width: 75, height: 95 },
        confidence: 0.85,
        embedding: "mock_face_embedding_2",
      },
    ]

    return NextResponse.json({
      success: true,
      faces: detectedFaces,
      cameraId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Face detection failed" }, { status: 500 })
  }
}
