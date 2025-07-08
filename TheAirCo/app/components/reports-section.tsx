"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, FileText, Brain } from "lucide-react"

interface ReportData {
  period: string
  totalHours: number
  productiveHours: number
  breakTime: number
  attendance: number
  emotionalState: {
    happy: number
    focused: number
    stressed: number
    tired: number
    neutral: number
  }
}

export default function ReportsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [reportType, setReportType] = useState("summary")

  const attendanceData = [
    { name: "Mon", present: 45, absent: 5, late: 3 },
    { name: "Tue", present: 47, absent: 3, late: 2 },
    { name: "Wed", present: 44, absent: 6, late: 4 },
    { name: "Thu", present: 48, absent: 2, late: 1 },
    { name: "Fri", present: 42, absent: 8, late: 5 },
    { name: "Sat", present: 15, absent: 35, late: 0 },
    { name: "Sun", present: 8, absent: 42, late: 0 },
  ]

  const productivityData = [
    { hour: "09:00", productivity: 85 },
    { hour: "10:00", productivity: 92 },
    { hour: "11:00", productivity: 88 },
    { hour: "12:00", productivity: 45 },
    { hour: "13:00", productivity: 35 },
    { hour: "14:00", productivity: 78 },
    { hour: "15:00", productivity: 82 },
    { hour: "16:00", productivity: 75 },
    { hour: "17:00", productivity: 68 },
  ]

  const emotionData = [
    { name: "Happy", value: 35, color: "#10B981" },
    { name: "Focused", value: 28, color: "#3B82F6" },
    { name: "Neutral", value: 22, color: "#6B7280" },
    { name: "Stressed", value: 10, color: "#EF4444" },
    { name: "Tired", value: 5, color: "#F59E0B" },
  ]

  const zoneActivityData = [
    { zone: "Workstation", time: 420, visits: 156 },
    { zone: "Meeting Room", time: 180, visits: 45 },
    { zone: "Break Area", time: 90, visits: 89 },
    { zone: "Entrance", time: 15, visits: 203 },
    { zone: "Restroom", time: 12, visits: 78 },
  ]

  const employeePerformanceData = [
    {
      name: "John Doe",
      attendance: 98,
      productivity: 87,
      avgHours: 8.5,
      emotionalWellbeing: 85,
      topEmotion: "focused",
    },
    {
      name: "Jane Smith",
      attendance: 95,
      productivity: 92,
      avgHours: 8.2,
      emotionalWellbeing: 88,
      topEmotion: "happy",
    },
    {
      name: "Mike Johnson",
      attendance: 88,
      productivity: 76,
      avgHours: 7.8,
      emotionalWellbeing: 72,
      topEmotion: "stressed",
    },
    {
      name: "Sarah Wilson",
      attendance: 92,
      productivity: 81,
      avgHours: 8.0,
      emotionalWellbeing: 79,
      topEmotion: "tired",
    },
  ]

  const exportReport = (format: string) => {
    console.log(`Exporting ${reportType} report as ${format}`)
  }

  const generateInsights = () => {
    return [
      {
        type: "positive",
        title: "High Productivity Period",
        description: "Peak productivity observed between 10:00-11:00 AM with 92% efficiency rate",
      },
      {
        type: "warning",
        title: "Stress Level Alert",
        description: "Mike Johnson showing elevated stress levels for 3 consecutive days",
      },
      {
        type: "info",
        title: "Zone Usage Pattern",
        description: "Meeting rooms have 40% higher usage on Tuesdays and Thursdays",
      },
      {
        type: "negative",
        title: "Late Arrival Trend",
        description: "Friday late arrivals increased by 25% compared to previous week",
      },
    ]
  }

  const insights = generateInsights()

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analytics & Reports</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="productivity">Productivity Report</SelectItem>
                  <SelectItem value="emotion">Emotion Analysis</SelectItem>
                  <SelectItem value="zone">Zone Activity</SelectItem>
                  <SelectItem value="individual">Individual Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Generate Report</label>
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>Automated analysis of employee behavior patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === "positive"
                    ? "border-green-500 bg-green-50"
                    : insight.type === "warning"
                      ? "border-yellow-500 bg-yellow-50"
                      : insight.type === "negative"
                        ? "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                }`}
              >
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Charts */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  present: { label: "Present", color: "hsl(var(--chart-1))" },
                  absent: { label: "Absent", color: "hsl(var(--chart-2))" },
                  late: { label: "Late", color: "hsl(var(--chart-3))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="present" fill="var(--color-present)" />
                    <Bar dataKey="absent" fill="var(--color-absent)" />
                    <Bar dataKey="late" fill="var(--color-late)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity">
          <Card>
            <CardHeader>
              <CardTitle>Daily Productivity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  productivity: { label: "Productivity %", color: "hsl(var(--chart-1))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="productivity" stroke="var(--color-productivity)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions">
          <Card>
            <CardHeader>
              <CardTitle>Emotional State Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {emotionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {emotionData.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: emotion.color }}></div>
                        <span className="font-medium">{emotion.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{emotion.value}%</div>
                        <Progress value={emotion.value} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <CardTitle>Zone Activity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneActivityData.map((zone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{zone.zone}</h4>
                      <Badge variant="outline">{zone.visits} visits</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Time</div>
                        <div className="text-lg font-bold">
                          {Math.floor(zone.time / 60)}h {zone.time % 60}m
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Visit Duration</div>
                        <div className="text-lg font-bold">{Math.round(zone.time / zone.visits)}m</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Employee Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformanceData.map((employee, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-lg">{employee.name}</h4>
                      <Badge variant="outline" className="capitalize">
                        Primarily {employee.topEmotion}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Attendance</div>
                        <div className="text-xl font-bold text-green-600">{employee.attendance}%</div>
                        <Progress value={employee.attendance} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Productivity</div>
                        <div className="text-xl font-bold text-blue-600">{employee.productivity}%</div>
                        <Progress value={employee.productivity} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Hours</div>
                        <div className="text-xl font-bold text-purple-600">{employee.avgHours}h</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Well-being</div>
                        <div className="text-xl font-bold text-orange-600">{employee.emotionalWellbeing}%</div>
                        <Progress value={employee.emotionalWellbeing} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
