"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Users, Settings, Maximize2, Play, Pause } from "lucide-react"

interface CameraFeed {
  id: string
  name: string
  location: string
  status: "online" | "offline"
  detectedFaces: Array<{
    id: string
    name: string
    confidence: number
    isEmployee: boolean
    emotion?: string
    position: { x: number; y: number; width: number; height: number }
  }>
}

interface LiveCameraFeedProps {
  expanded?: boolean
}

export default function LiveCameraFeed({ expanded = false }: LiveCameraFeedProps) {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    {
      id: "cam1",
      name: "Main Entrance",
      location: "Ground Floor",
      status: "online",
      detectedFaces: [
        {
          id: "1",
          name: "John Doe",
          confidence: 98.5,
          isEmployee: true,
          emotion: "neutral",
          position: { x: 100, y: 50, width: 80, height: 100 },
        },
        {
          id: "2",
          name: "Unknown",
          confidence: 85.2,
          isEmployee: false,
          position: { x: 300, y: 80, width: 75, height: 95 },
        },
      ],
    },
    {
      id: "cam2",
      name: "Office Floor",
      location: "Second Floor",
      status: "online",
      detectedFaces: [
        {
          id: "3",
          name: "Jane Smith",
          confidence: 96.8,
          isEmployee: true,
          emotion: "happy",
          position: { x: 200, y: 100, width: 82, height: 98 },
        },
      ],
    },
    {
      id: "cam3",
      name: "Break Room",
      location: "Second Floor",
      status: "online",
      detectedFaces: [],
    },
    {
      id: "cam4",
      name: "Parking Lot",
      location: "Outside",
      status: "offline",
      detectedFaces: [],
    },
  ])

  const [selectedCamera, setSelectedCamera] = useState(cameras[0])
  const [isRecording, setIsRecording] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulate camera feed updates
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((cam) => ({
          ...cam,
          detectedFaces: cam.status === "online" ? generateRandomFaces() : [],
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const generateRandomFaces = () => {
    const employees = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"]
    const emotions = ["neutral", "happy", "focused", "tired", "stressed"]
    const faces = []

    const numFaces = Math.floor(Math.random() * 4)
    for (let i = 0; i < numFaces; i++) {
      const isEmployee = Math.random() > 0.2
      faces.push({
        id: `face_${i}`,
        name: isEmployee ? employees[Math.floor(Math.random() * employees.length)] : "Unknown",
        confidence: 80 + Math.random() * 20,
        isEmployee,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        position: {
          x: Math.random() * 400,
          y: Math.random() * 200,
          width: 60 + Math.random() * 40,
          height: 80 + Math.random() * 40,
        },
      })
    }
    return faces
  }

  const CameraView = ({ camera, isMain = false }: { camera: CameraFeed; isMain?: boolean }) => (
    <div className={`relative ${isMain ? "h-96" : "h-48"} bg-gray-900 rounded-lg overflow-hidden`}>
      {/* Simulated camera feed */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-75">{camera.name}</p>
          <p className="text-xs opacity-50">{camera.location}</p>
        </div>
      </div>

      {/* Face detection overlays */}
      {camera.detectedFaces.map((face) => (
        <div
          key={face.id}
          className="absolute border-2 border-blue-400 rounded"
          style={{
            left: face.position.x,
            top: face.position.y,
            width: face.position.width,
            height: face.position.height,
          }}
        >
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {face.name} ({face.confidence.toFixed(1)}%)
            {face.emotion && <span className="ml-1 capitalize">- {face.emotion}</span>}
          </div>
          {!face.isEmployee && (
            <div className="absolute -bottom-6 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs">⚠️ Unknown</div>
          )}
        </div>
      ))}

      {/* Camera status indicator */}
      <div className="absolute top-2 right-2">
        <Badge variant={camera.status === "online" ? "default" : "destructive"}>
          {camera.status === "online" ? "● Live" : "● Offline"}
        </Badge>
      </div>

      {/* Face count */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        <Users className="h-3 w-3 inline mr-1" />
        {camera.detectedFaces.length} detected
      </div>
    </div>
  )

  if (expanded) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Camera Feeds</span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsRecording(!isRecording)}>
                  {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cameras.map((camera) => (
                <div key={camera.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{camera.name}</h3>
                    <Badge variant={camera.status === "online" ? "default" : "destructive"}>{camera.status}</Badge>
                  </div>
                  <CameraView camera={camera} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Camera Feed</span>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedCamera.id}
              onValueChange={(value) => {
                const camera = cameras.find((c) => c.id === value)
                if (camera) setSelectedCamera(camera)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Real-time face detection and recognition</CardDescription>
      </CardHeader>
      <CardContent>
        <CameraView camera={selectedCamera} isMain />

        {/* Detection Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded">
            <div className="text-lg font-bold text-green-600">
              {selectedCamera.detectedFaces.filter((f) => f.isEmployee).length}
            </div>
            <div className="text-sm text-gray-600">Employees</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-lg font-bold text-red-600">
              {selectedCamera.detectedFaces.filter((f) => !f.isEmployee).length}
            </div>
            <div className="text-sm text-gray-600">Unknown</div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-lg font-bold text-blue-600">{selectedCamera.detectedFaces.length}</div>
            <div className="text-sm text-gray-600">Total Faces</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
