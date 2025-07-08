"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Users, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Activity
} from 'lucide-react'
import { arcFaceService } from '@/lib/arcface-service'
import { theAirCoService } from '@/lib/surveillance-service'

export default function FaceRecognitionStatus() {
  const [recognitionStats, setRecognitionStats] = useState({
    totalEmployees: 0,
    isInitialized: false,
    threshold: 0.6
  })
  const [employees, setEmployees] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    loadRecognitionStats()
    
    const interval = setInterval(() => {
      loadRecognitionStats()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadRecognitionStats = () => {
    const stats = arcFaceService.getRecognitionStats()
    const employeeList = theAirCoService.getEmployees()
    
    setRecognitionStats(stats)
    setEmployees(employeeList)
    setLastUpdate(new Date())
  }

  const getTrainedEmployeesCount = () => {
    return employees.filter(emp => 
      emp.faceImages && emp.faceImages.length > 0
    ).length
  }

  const getRecognitionAccuracy = () => {
    const trainedCount = getTrainedEmployeesCount()
    const totalCount = employees.length
    
    if (totalCount === 0) return 0
    return Math.round((trainedCount / totalCount) * 100)
  }

  const getThresholdColor = (threshold: number) => {
    if (threshold < 0.4) return 'text-red-600'
    if (threshold < 0.6) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <CardTitle>ArcFace Recognition System</CardTitle>
          </div>
          <Badge 
            variant={recognitionStats.isInitialized ? "default" : "secondary"}
            className={recognitionStats.isInitialized ? "bg-green-100 text-green-800" : ""}
          >
            {recognitionStats.isInitialized ? "READY" : "INITIALIZING"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-gray-600">Total Employees</p>
            <p className="text-lg font-bold text-blue-600">{recognitionStats.totalEmployees}</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Target className="h-6 w-6 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-gray-600">Face Trained</p>
            <p className="text-lg font-bold text-green-600">{getTrainedEmployeesCount()}</p>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Activity className="h-6 w-6 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-gray-600">Accuracy</p>
            <p className="text-lg font-bold text-purple-600">{getRecognitionAccuracy()}%</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Settings className="h-6 w-6 mx-auto mb-1 text-orange-600" />
            <p className="text-xs text-gray-600">Threshold</p>
            <p className={`text-lg font-bold ${getThresholdColor(recognitionStats.threshold)}`}>
              {Math.round(recognitionStats.threshold * 100)}%
            </p>
          </div>
        </div>

        {/* Recognition Accuracy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recognition Coverage</span>
            <span className="text-sm text-gray-500">{getRecognitionAccuracy()}%</span>
          </div>
          <Progress value={getRecognitionAccuracy()} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Employee Training Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Employee Training Status</h4>
          <div className="space-y-2">
            {employees.map((employee) => {
              const isTrained = employee.faceImages && employee.faceImages.length > 0
              return (
                <div key={employee.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    {isTrained ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">{employee.name}</span>
                    <span className="text-xs text-gray-500">({employee.employeeId})</span>
                  </div>
                  <Badge variant={isTrained ? "default" : "secondary"} className="text-xs">
                    {isTrained ? `${employee.faceImages.length} images` : "Not trained"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Model Status:</span>
              <span className="font-medium">
                {recognitionStats.isInitialized ? "Loaded" : "Loading..."}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recognition Threshold:</span>
              <span className={`font-medium ${getThresholdColor(recognitionStats.threshold)}`}>
                {Math.round(recognitionStats.threshold * 100)}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Version:</span>
              <span className="font-medium">ArcFace v1.0</span>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        {getRecognitionAccuracy() < 100 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Training Required</p>
                <p className="text-yellow-700 mt-1">
                  {employees.length - getTrainedEmployeesCount()} employee(s) need face training for optimal recognition accuracy.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 