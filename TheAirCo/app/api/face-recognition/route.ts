import { type NextRequest, NextResponse } from "next/server"

// Mock employee database
const employeeDatabase = [
  {
    id: "emp_001",
    name: "John Doe",
    embedding: "mock_face_embedding_1",
    department: "Engineering",
    position: "Senior Developer",
  },
  {
    id: "emp_002",
    name: "Jane Smith",
    embedding: "mock_face_embedding_2",
    department: "Marketing",
    position: "Marketing Manager",
  },
  {
    id: "emp_003",
    name: "Mike Johnson",
    embedding: "mock_face_embedding_3",
    department: "Sales",
    position: "Sales Representative",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { faceEmbedding, threshold = 0.7 } = await request.json()

    // Simulate face recognition processing
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Mock face matching logic
    const matchedEmployee = employeeDatabase.find(
      (emp) =>
        // In real implementation, this would compare embeddings
        Math.random() > 0.3, // 70% chance of match for demo
    )

    if (matchedEmployee) {
      return NextResponse.json({
        success: true,
        match: true,
        employee: matchedEmployee,
        confidence: 0.85 + Math.random() * 0.15,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({
        success: true,
        match: false,
        confidence: 0.2 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Face recognition failed" }, { status: 500 })
  }
}
