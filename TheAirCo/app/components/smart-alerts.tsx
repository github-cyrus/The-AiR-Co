"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  AlertTriangle, 
  UserX, 
  Shield, 
  Clock, 
  CheckCircle,
  X,
  Zap,
  MapPin
} from 'lucide-react'
import { theAirCoService, type Alert as AlertType } from '@/lib/surveillance-service'
import moment from 'moment'

interface SmartAlertsProps {
  expanded?: boolean
}

export default function SmartAlerts({ expanded = false }: SmartAlertsProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Load alerts
  useEffect(() => {
    loadAlerts()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadAlerts()
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const loadAlerts = () => {
    setIsLoading(true)
    try {
      const currentAlerts = theAirCoService.getAlerts()
      setAlerts(currentAlerts)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resolveAlert = (alertId: string) => {
    theAirCoService.resolveAlert(alertId)
    loadAlerts() // Reload to update the list
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'unknown-person':
        return <UserX className="h-4 w-4 text-red-500" />
      case 'unauthorized-access':
        return <Shield className="h-4 w-4 text-orange-500" />
      case 'system-error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertCounts = () => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: alerts.length
    }

    alerts.forEach(alert => {
      counts[alert.severity as keyof typeof counts]++
    })

    return counts
  }

  const alertCounts = getAlertCounts()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Security Alerts</CardTitle>
            {alertCounts.total > 0 && (
              <Badge variant="destructive" className="ml-2">
                {alertCounts.total}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {moment(lastUpdate).format('HH:mm:ss')}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={loadAlerts}
              disabled={isLoading}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-red-600 font-medium">Critical</p>
            <p className="text-lg font-bold text-red-700">{alertCounts.critical}</p>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 font-medium">High</p>
            <p className="text-lg font-bold text-orange-700">{alertCounts.high}</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-600 font-medium">Medium</p>
            <p className="text-lg font-bold text-yellow-700">{alertCounts.medium}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Low</p>
            <p className="text-lg font-bold text-blue-700">{alertCounts.low}</p>
          </div>
        </div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-gray-500">No active alerts</p>
            <p className="text-sm text-gray-400">All systems are secure</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts
              .sort((a, b) => {
                // Sort by severity first, then by timestamp
                const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
                const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] ?? 4
                const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] ?? 4
                
                if (aSeverity !== bSeverity) {
                  return aSeverity - bSeverity
                }
                
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              })
              .slice(0, expanded ? undefined : 5)
              .map((alert) => (
                <Alert key={alert.id} className={`border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{alert.message}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{moment(alert.timestamp).format('HH:mm:ss')}</span>
                          </div>
                          {alert.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resolveAlert(alert.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Alert>
              ))}
          </div>
        )}

        {/* Quick Actions */}
        {alerts.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => alerts.forEach(alert => resolveAlert(alert.id))}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolve All
              </Button>
            </div>
          </div>
        )}

        {/* System Status */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">System Security Status</span>
              </div>
              <Badge variant={alertCounts.total === 0 ? "default" : "destructive"}>
                {alertCounts.total === 0 ? "Secure" : "Alert"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last security scan: {moment().format('HH:mm:ss')}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
} 