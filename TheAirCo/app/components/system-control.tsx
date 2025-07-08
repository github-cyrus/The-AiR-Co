"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Power, 
  PowerOff, 
  Settings, 
  Shield, 
  Camera, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { theAirCoService } from '@/lib/surveillance-service'

interface SystemControlProps {
  onSystemStateChange?: (isActive: boolean) => void
}

export default function SystemControl({ onSystemStateChange }: SystemControlProps) {
  const [isSystemActive, setIsSystemActive] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initializationProgress, setInitializationProgress] = useState(0)
  const [systemStatus, setSystemStatus] = useState({
    isInitialized: false,
    isActive: false,
    cameraStatus: 'offline',
    employeeCount: 0,
    activeEmployees: 0,
    alerts: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Load initial system status
  useEffect(() => {
    loadSystemStatus()
  }, [])

  const loadSystemStatus = () => {
    const status = theAirCoService.getSystemStatus()
    const employees = theAirCoService.getEmployees()
    const alerts = theAirCoService.getAlerts()
    
    setSystemStatus({
      isInitialized: status.isInitialized,
      isActive: status.isActive,
      cameraStatus: status.isActive ? 'online' : 'offline',
      employeeCount: employees.length,
      activeEmployees: employees.filter(emp => emp.isActive).length,
      alerts: alerts.length
    })
  }

  const initializeSystem = async () => {
    setIsInitializing(true)
    setInitializationProgress(0)
    setError(null)

    try {
      // Simulate initialization steps
      const steps = [
        'Loading face recognition models...',
        'Initializing camera systems...',
        'Setting up employee database...',
        'Configuring security protocols...',
        'Starting TheAirCo services...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setInitializationProgress((i / steps.length) * 100)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      await theAirCoService.initialize()
      setInitializationProgress(100)
      
      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      loadSystemStatus()
      setIsInitializing(false)
      
    } catch (error) {
      setError('Failed to initialize system. Please try again.')
      setIsInitializing(false)
    }
  }

  const startSystem = async () => {
    if (!systemStatus.isInitialized) {
      await initializeSystem()
    }

    try {
      await theAirCoService.startTheAirCo()
      setIsSystemActive(true)
      loadSystemStatus()
      if (onSystemStateChange) {
        onSystemStateChange(true)
      }
    } catch (error) {
      setError('Failed to start TheAirCo system.')
    }
  }

  const stopSystem = async () => {
    try {
      await theAirCoService.stopTheAirCo()
      setIsSystemActive(false)
      loadSystemStatus()
      if (onSystemStateChange) {
        onSystemStateChange(false)
      }
    } catch (error) {
      setError('Failed to stop TheAirCo system.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600'
      case 'offline':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <CardTitle>System Control</CardTitle>
          </div>
          <Badge 
            variant={isSystemActive ? "default" : "secondary"}
            className={isSystemActive ? "bg-green-100 text-green-800" : ""}
          >
            {isSystemActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Camera className={`h-6 w-6 mx-auto mb-1 ${getStatusColor(systemStatus.cameraStatus)}`} />
            <p className="text-xs text-gray-600">Camera Status</p>
            <p className="text-sm font-bold">{systemStatus.cameraStatus.toUpperCase()}</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-gray-600">Employees</p>
            <p className="text-sm font-bold">{systemStatus.employeeCount}</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Shield className="h-6 w-6 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-gray-600">Active</p>
            <p className="text-sm font-bold">{systemStatus.activeEmployees}</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-600" />
            <p className="text-xs text-gray-600">Alerts</p>
            <p className="text-sm font-bold">{systemStatus.alerts}</p>
          </div>
        </div>

        {/* Initialization Progress */}
        {isInitializing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Initializing System...</span>
              <span className="text-sm text-gray-500">{Math.round(initializationProgress)}%</span>
            </div>
            <Progress value={initializationProgress} className="h-2" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          {!isSystemActive ? (
            <Button
              onClick={startSystem}
              disabled={isInitializing}
              size="lg"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <Power className="h-5 w-5" />
                  <span>Start System</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={stopSystem}
              variant="destructive"
              size="lg"
              className="flex items-center space-x-2"
            >
              <PowerOff className="h-5 w-5" />
              <span>Stop System</span>
            </Button>
          )}
        </div>

        {/* System Requirements */}
        {!systemStatus.isInitialized && !isInitializing && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">System Requirements:</p>
                <ul className="text-sm space-y-1">
                  <li>• Camera access permission</li>
                  <li>• At least one registered employee</li>
                  <li>• Face recognition models loaded</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Version:</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">
                {isSystemActive ? "Running" : "Stopped"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Security Level:</span>
              <span className="font-medium text-green-600">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 