import { type NextRequest, NextResponse } from "next/server"

// Mock attendance records
const attendanceRecords = [
  {
    id: "att_001",
    employeeId: "emp_001",
    employeeName: "John Doe",
    date: "2024-01-04",
    checkIn: "09:00:00",
    checkOut: "17:30:00",
    totalHours: 8.5,
    status: "present",
  },
  {
    id: "att_002",
    employeeId: "emp_002",
    employeeName: "Jane Smith",
    date: "2024-01-04",
    checkIn: "08:45:00",
    checkOut: null,
    totalHours: 0,
    status: "present",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const employeeId = searchParams.get("employeeId")

  let filteredRecords = attendanceRecords.filter((record) => record.date === date)

  if (employeeId) {
    filteredRecords = filteredRecords.filter((record) => record.employeeId === employeeId)
  }

  return NextResponse.json({
    success: true,
    records: filteredRecords,
    date,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { employeeId, employeeName, type, timestamp, location } = await request.json()

    const date = new Date(timestamp).toISOString().split("T")[0]
    const time = new Date(timestamp).toISOString().split("T")[1].split(".")[0]

    // Find existing record for today
    const existingRecord = attendanceRecords.find((record) => record.employeeId === employeeId && record.date === date)

    if (existingRecord) {
      if (type === "checkout" && !existingRecord.checkOut) {
        existingRecord.checkOut = time
        const checkInTime = new Date(`${date}T${existingRecord.checkIn}`)
        const checkOutTime = new Date(`${date}T${time}`)
        existingRecord.totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
      }
    } else if (type === "checkin") {
      const newRecord = {
        id: `att_${Date.now()}`,
        employeeId,
        employeeName,
        date,
        checkIn: time,
        checkOut: null,
        totalHours: 0,
        status: "present",
      }
      attendanceRecords.push(newRecord)
    }

    return NextResponse.json({
      success: true,
      message: `${type} recorded successfully`,
      timestamp,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
  }
}
