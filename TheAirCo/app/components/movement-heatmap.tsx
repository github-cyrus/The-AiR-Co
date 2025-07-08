"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"

interface ZoneData {
  id: string
  name: string
  coordinates: { x: number; y: number; width: number; height: number }
  activity: number
  averageTime: number
  peakHours: string[]
  currentOccupancy: number
  maxOccupancy: number
}

interface MovementData {
  timestamp: string
  employeeId: string
  zone: string
  duration: number
  activity: number
}

export default function MovementHeatmap() {
  const [zones, setZones] = useState<ZoneData[]>([
    {
      id: "entrance",
      name: "Main Entrance",
      coordinates: { x: 50, y: 50, width: 100, height: 80 },
      activity: 85,
      averageTime: 2.5,
      peakHours: ["09:00", "12:00", "17:00"],
      currentOccupancy: 3,
      maxOccupancy: 10,
    },
    {
      id: "workstation",
      name: "Workstation Area",
      coordinates: { x: 200, y: 100, width: 300, height: 200 },
      activity: 95,
      averageTime: 240,
      peakHours: ["10:00", "14:00", "16:00"],
      currentOccupancy: 35,
      maxOccupancy: 50,
    },
    {
      id: "meeting",
      name: "Meeting Rooms",
      coordinates: { x: 550, y: 100, width: 150, height: 120 },
      activity: 60,
      averageTime: 45,
      peakHours: ["10:30", "14:30"],
      currentOccupancy: 8,
      maxOccupancy: 20,
    },
    {
      id: "break",
      name: "Break Area",
      coordinates: { x: 200, y: 350, width: 200, height: 100 },
      activity: 40,
      averageTime: 15,
      peakHours: ["12:00", "15:30"],
      currentOccupancy: 5,
      maxOccupancy: 15,
    },
    {
      id: "restroom",
      name: "Restroom",
      coordinates: { x: 450, y: 350, width: 80, height: 80 },
      activity: 25,
      averageTime: 3,
      peakHours: ["11:00", "15:00"],
      currentOccupancy: 1,
      maxOccupancy: 5,
    },
  ])

  const [selectedTimeRange, setSelectedTimeRange] = useState("today")
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("09:00")

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((zone) => ({
          ...zone,
          activity: Math.max(0, Math.min(100, zone.activity + (Math.random() - 0.5) * 10)),
          currentOccupancy: Math.max(
            0,
            Math.min(zone.maxOccupancy, zone.currentOccupancy + Math.floor((Math.random() - 0.5) * 3)),
          ),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return "bg-red-500"
    if (activity >= 60) return "bg-orange-500"
    if (activity >= 40) return "bg-yellow-500"
    if (activity >= 20) return "bg-green-500"
    return "bg-blue-500"
  }

  const getActivityOpacity = (activity: number) => {
    return Math.max(0.3, activity / 100)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Movement Heatmap Controls</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Badge variant="outline">{currentTime}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Playback Speed</label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">1x</span>
                <Slider
                  value={playbackSpeed}
                  onValueChange={setPlaybackSpeed}
                  max={5}
                  min={1}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm">5x</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Current Time</label>
              <div className="text-lg font-mono">{currentTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Office Layout & Activity Heatmap</CardTitle>
          <CardDescription>Real-time visualization of employee movement patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-100 rounded-lg p-4" style={{ height: "500px" }}>
            {/* Floor Plan Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              {/* Office layout lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 750 500">
                {/* Walls */}
                <rect x="40" y="40" width="670" height="420" fill="none" stroke="#ccc" strokeWidth="3" />
                <line x1="40" y1="180" x2="710" y2="180" stroke="#ccc" strokeWidth="1" />
                <line x1="40" y1="320" x2="710" y2="320" stroke="#ccc" strokeWidth="1" />
                <line x1="180" y1="40" x2="180" y2="460" stroke="#ccc" strokeWidth="1" />
                <line x1="530" y1="40" x2="530" y2="460" stroke="#ccc" strokeWidth="1" />
              </svg>
            </div>

            {/* Zone Overlays */}
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute ${getActivityColor(zone.activity)} rounded-lg transition-all duration-300`}
                style={{
                  left: zone.coordinates.x,
                  top: zone.coordinates.y,
                  width: zone.coordinates.width,
                  height: zone.coordinates.height,
                  opacity: getActivityOpacity(zone.activity),
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                  {zone.name}
                </div>
                <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                  {zone.activity}%
                </div>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                  {zone.currentOccupancy}/{zone.maxOccupancy}
                </div>
              </div>
            ))}

            {/* Activity Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
              <div className="text-sm font-semibold mb-2">Activity Level</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs">Very High (80-100%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs">High (60-80%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs">Medium (40-60%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs">Low (20-40%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs">Very Low (0-20%)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Zone Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{zone.name}</h3>
                  <Badge variant="outline">{zone.activity}% active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Occupancy:</span>
                    <span>
                      {zone.currentOccupancy}/{zone.maxOccupancy}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Time:</span>
                    <span>
                      {zone.averageTime > 60
                        ? `${Math.floor(zone.averageTime / 60)}h ${zone.averageTime % 60}m`
                        : `${zone.averageTime}m`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Peak Hours:</span>
                    <span>{zone.peakHours.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
