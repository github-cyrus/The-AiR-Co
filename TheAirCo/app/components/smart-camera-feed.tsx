"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Camera, 
  User, 
  UserX, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Settings
} from 'lucide-react'
import { theAirCoService, type DetectionResult, type Employee } from '@/lib/surveillance-service'
import { arcFaceService, type RecognitionResult } from '@/lib/arcface-service'

interface SmartCameraFeedProps {
  expanded?: boolean
}

export default function SmartCameraFeed({ expanded = false }: SmartCameraFeedProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detections, setDetections] = useState<DetectionResult[]>([])
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [unknownPersonDetected, setUnknownPersonDetected] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)
  const [fps, setFps] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState({ isActive: false, isInitialized: false })

  const webcamRef = useRef<Webcam>(null)
  const processingRef = useRef<NodeJS.Timeout>()
  const frameCountRef = useRef(0)
  const lastFpsUpdateRef = useRef(Date.now())

  // Initialize TheAirCo system
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        await theAirCoService.initialize()
        setSystemStatus(theAirCoService.getSystemStatus())
      } catch (error) {
        console.error('Failed to initialize TheAirCo system:', error)
        setCameraError('Failed to initialize TheAirCo system')
      }
    }

    initializeSystem()
  }, [])

  // Start/stop TheAirCo
  useEffect(() => {
    if (isStreaming && systemStatus.isInitialized) {
      theAirCoService.startTheAirCo()
      setSystemStatus(theAirCoService.getSystemStatus())
    } else if (!isStreaming) {
      theAirCoService.stopTheAirCo()
      setSystemStatus(theAirCoService.getSystemStatus())
    }
  }, [isStreaming, systemStatus.isInitialized])

  // FPS calculation
  useEffect(() => {
    const updateFps = () => {
      const now = Date.now()
      const timeDiff = now - lastFpsUpdateRef.current
      if (timeDiff >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / timeDiff))
        frameCountRef.current = 0
        lastFpsUpdateRef.current = now
      }
    }

    const fpsInterval = setInterval(updateFps, 1000)
    return () => clearInterval(fpsInterval)
  }, [])

  const startStreaming = useCallback(() => {
    setIsStreaming(true)
    setCameraError(null)
  }, [])

  const stopStreaming = useCallback(() => {
    setIsStreaming(false)
    setDetections([])
    setCurrentEmployee(null)
    setUnknownPersonDetected(false)
  }, [])

  const handleUserMediaError = useCallback((error: string) => {
    setCameraError(`Camera access error: ${error}`)
    setIsStreaming(false)
  }, [])

  const processFrame = useCallback(async () => {
    if (!webcamRef.current || !isStreaming || isProcessing) return

    setIsProcessing(true)
    const startTime = Date.now()

    try {
      // Get the current video frame
      const videoElement = webcamRef.current.video
      if (!videoElement) {
        setIsProcessing(false)
        return
      }

      // Use ArcFace to recognize faces in real-time
      const recognitionResult = await arcFaceService.recognizeFace(videoElement)
      
      if (recognitionResult) {
        const detection: DetectionResult = {
          face: {} as any,
          confidence: recognitionResult.confidence,
          isUnknown: !recognitionResult.isMatch,
          recognitionResult: recognitionResult
        }

        if (recognitionResult.isMatch) {
          // Find the employee in our database
          const employees = theAirCoService.getEmployees()
          const employee = employees.find(emp => emp.id === recognitionResult.employeeId)
          
          if (employee) {
            detection.employee = employee
            detection.descriptor = employee.faceDescriptor
            setCurrentEmployee(employee)
            
            // Update employee's last seen time
            employee.lastSeen = new Date()
            
            // Handle attendance and movement tracking
            await theAirCoService.handleKnownEmployee(detection)
          }
        } else {
          setCurrentEmployee(null)
          setUnknownPersonDetected(true)
          
          // Handle unknown person alert
          await theAirCoService.handleUnknownPerson(detection)
        }

        setDetections([detection])
      } else {
        setDetections([])
        setCurrentEmployee(null)
        setUnknownPersonDetected(false)
      }

      const endTime = Date.now()
      setProcessingTime(endTime - startTime)
      frameCountRef.current++

    } catch (error) {
      console.error('Error processing frame:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [isStreaming, isProcessing])

  // Process frames when streaming
  useEffect(() => {
    if (isStreaming) {
      processingRef.current = setInterval(processFrame, 1000) // Process every second
    } else {
      if (processingRef.current) {
        clearInterval(processingRef.current)
      }
    }

    return () => {
      if (processingRef.current) {
        clearInterval(processingRef.current)
      }
    }
  }, [isStreaming, processFrame])

  const videoConstraints = {
    width: expanded ? 1280 : 640,
    height: expanded ? 720 : 480,
    facingMode: "environment"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <CardTitle>Smart Camera Feed</CardTitle>
            <Badge variant={isStreaming ? "default" : "secondary"}>
              {isStreaming ? "Live" : "Offline"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{fps} FPS</Badge>
            <Badge variant="outline">{processingTime}ms</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={isStreaming ? stopStreaming : startStreaming}
            >
              {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isStreaming ? "Stop" : "Start"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Feed */}
        <div className="relative">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {isStreaming ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                onUserMediaError={handleUserMediaError}
                className="w-full h-auto"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-900 text-gray-400">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Camera feed will appear here</p>
                  <p className="text-sm">Click Start to begin TheAirCo</p>
                </div>
              </div>
            )}

            {/* Detection Overlays */}
            {isStreaming && (
              <div className="absolute inset-0 pointer-events-none">
                {detections.map((detection, index) => (
                  <div
                    key={index}
                    className={`absolute border-2 rounded-lg ${
                      detection.isUnknown 
                        ? 'border-red-500 bg-red-500/20' 
                        : 'border-green-500 bg-green-500/20'
                    }`}
                    style={{
                      left: `${20 + index * 30}%`,
                      top: `${20 + index * 20}%`,
                      width: '120px',
                      height: '120px',
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-black/80 text-white px-2 py-1 rounded text-xs">
                      {detection.isUnknown ? 'Unknown' : detection.employee?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs">
                Processing...
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {cameraError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Detection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Employee */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Current Employee</span>
              </div>
              <p className="text-lg font-bold mt-1">
                {currentEmployee ? currentEmployee.name : 'None Detected'}
              </p>
              {currentEmployee && (
                <p className="text-xs text-gray-500">{currentEmployee.department}</p>
              )}
            </CardContent>
          </Card>

          {/* Unknown Person Alert */}
          <Card className={unknownPersonDetected ? 'border-red-500 bg-red-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className={`h-4 w-4 ${unknownPersonDetected ? 'text-red-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Unknown Person</span>
              </div>
              <p className={`text-lg font-bold mt-1 ${unknownPersonDetected ? 'text-red-600' : 'text-gray-400'}`}>
                {unknownPersonDetected ? 'DETECTED' : 'None'}
              </p>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">System Status</span>
              </div>
              <p className="text-lg font-bold mt-1">
                {systemStatus.isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-gray-500">
                {systemStatus.isInitialized ? 'Initialized' : 'Initializing...'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detection Details */}
        {detections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {detections.map((detection, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      {detection.isUnknown ? (
                        <UserX className="h-4 w-4 text-red-500" />
                      ) : (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {detection.isUnknown ? 'Unknown Person' : detection.employee?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={detection.confidence * 100} className="w-20" />
                      <span className="text-xs text-gray-500">
                        {Math.round(detection.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
} 