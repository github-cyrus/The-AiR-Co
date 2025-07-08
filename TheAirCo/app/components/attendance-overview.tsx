"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Download, Calendar } from "lucide-react"

interface AttendanceRecord {
  id: string
  name: string
  avatar: string
  checkIn: string
  checkOut?: string
  status: "present" | "absent" | "late" | "early_leave"
  totalHours: number
  productiveHours: number
  breakTime: number
  emotion: string
}

interface AttendanceOverviewProps {
  expanded?: boolean
}

export default function AttendanceOverview({ expanded = false }: AttendanceOverviewProps) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      id: "1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: "09:00",
      checkOut: "17:30",
      status: "present",
      totalHours: 8.5,
      productiveHours: 7.2,
      breakTime: 1.3,
      emotion: "focused",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: "08:45",
      status: "present",
      totalHours: 8.0,
      productiveHours: 6.8,
      breakTime: 1.2,
      emotion: "happy",
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: "09:15",
      status: "late",
      totalHours: 7.5,
      productiveHours: 6.5,
      breakTime: 1.0,
      emotion: "stressed",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: "09:00",
      checkOut: "16:00",
      status: "early_leave",
      totalHours: 7.0,
      productiveHours: 5.5,
      breakTime: 1.5,
      emotion: "tired",
    },
    {
      id: "5",
      name: "David Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: "08:30",
      status: "present",
      totalHours: 8.5,
      productiveHours: 7.8,
      breakTime: 0.7,
      emotion: "focused",
    },
  ])

  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 55,
    present: 42,
    absent: 8,
    late: 3,
    earlyLeave: 2,
    avgWorkHours: 8.2,
    avgProductiveHours: 7.1,
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAttendanceData((prev) =>
        prev.map((record) => ({
          ...record,
          totalHours: record.totalHours + (Math.random() - 0.5) * 0.1,
          productiveHours: record.productiveHours + (Math.random() - 0.5) * 0.05,
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "early_leave":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "text-green-600"
      case "focused":
        return "text-blue-600"
      case "stressed":
        return "text-red-600"
      case "tired":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const exportAttendance = (format: "excel" | "pdf" | "csv") => {
    // Simulate export functionality
    console.log(`Exporting attendance data as ${format}`)
  }

  if (expanded) {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{attendanceStats.totalEmployees}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-sm text-gray-600">Present</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
              <div className="text-sm text-gray-600">Late</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{attendanceStats.earlyLeave}</div>
              <div className="text-sm text-gray-600">Early Leave</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{attendanceStats.avgWorkHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Avg Work</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-600">{attendanceStats.avgProductiveHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Avg Productive</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Attendance</span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => exportAttendance("excel")}>
                  <Download className="h-4 w-4 mr-1" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportAttendance("pdf")}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportAttendance("csv")}>
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Productive Hours</TableHead>
                  <TableHead>Break Time</TableHead>
                  <TableHead>Emotion</TableHead>
                  <TableHead>Productivity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {record.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{record.name}</span>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut || "---"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>{record.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>{record.totalHours.toFixed(1)}h</TableCell>
                    <TableCell>{record.productiveHours.toFixed(1)}h</TableCell>
                    <TableCell>{record.breakTime.toFixed(1)}h</TableCell>
                    <TableCell>
                      <span className={getEmotionColor(record.emotion)}>{record.emotion}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={(record.productiveHours / record.totalHours) * 100} className="w-16" />
                        <span className="text-sm">
                          {((record.productiveHours / record.totalHours) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Today's Attendance</span>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            View Full
          </Button>
        </CardTitle>
        <CardDescription>Real-time attendance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded">
            <div className="text-lg font-bold text-green-600">{attendanceStats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-lg font-bold text-red-600">{attendanceStats.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
        </div>

        <div className="space-y-2">
          {attendanceData.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={record.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {record.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{record.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm">{record.checkIn}</div>
                <Badge className={`${getStatusColor(record.status)} text-xs`}>{record.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Average work hours: <span className="font-semibold">{attendanceStats.avgWorkHours.toFixed(1)}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
