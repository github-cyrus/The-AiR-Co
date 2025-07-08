"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, User, Clock, MapPin, Brain, Volume2, CheckCircle } from "lucide-react"

interface AlertItem {
  id: string
  type: "security" | "attendance" | "emotion" | "emergency" | "system"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: string
  location?: string
  employee?: string
  acknowledged: boolean
}

interface AlertsPanelProps {
  alerts: AlertItem[]
}

export default function AlertsPanel({ alerts: initialAlerts }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      type: "security",
      severity: "high",
      title: "Unknown Person Detected",
      description: "Unrecognized individual detected at main entrance",
      timestamp: "2024-01-04 10:15:00",
      location: "Main Entrance",
      acknowledged: false,
    },
    {
      id: "2",
      type: "emotion",
      severity: "medium",
      title: "Employee Stress Alert",
      description: "Mike Johnson showing elevated stress levels",
      timestamp: "2024-01-04 09:45:00",
      employee: "Mike Johnson",
      location: "Workstation Area",
      acknowledged: false,
    },
    {
      id: "3",
      type: "attendance",
      severity: "low",
      title: "Late Arrival",
      description: "Sarah Wilson arrived 15 minutes late",
      timestamp: "2024-01-04 09:15:00",
      employee: "Sarah Wilson",
      acknowledged: true,
    },
    {
      id: "4",
      type: "emergency",
      severity: "critical",
      title: "Emergency Keyword Detected",
      description: "Emergency keyword detected in meeting room audio",
      timestamp: "2024-01-04 08:30:00",
      location: "Meeting Room B",
      acknowledged: false,
    },
    {
      id: "5",
      type: "system",
      severity: "low",
      title: "Camera Maintenance",
      description: "Camera 4 requires cleaning - image quality degraded",
      timestamp: "2024-01-04 08:00:00",
      location: "Parking Lot",
      acknowledged: false,
    },
  ])

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      const alertTypes = ["security", "attendance", "emotion", "emergency", "system"]
      const severities = ["low", "medium", "high", "critical"]
      const employees = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"]
      const locations = ["Main Entrance", "Workstation Area", "Meeting Room A", "Break Area"]

      if (Math.random() > 0.7) {
        // 30% chance of new alert
        const newAlert: AlertItem = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)] as any,
          severity: severities[Math.floor(Math.random() * severities.length)] as any,
          title: "New Alert Generated",
          description: "System generated alert for demonstration",
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          location: locations[Math.floor(Math.random() * locations.length)],
          employee: Math.random() > 0.5 ? employees[Math.floor(Math.random() * employees.length)] : undefined,
          acknowledged: false,
        }
        setAlerts((prev) => [newAlert, ...prev].slice(0, 20)) // Keep only latest 20 alerts
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return <User className="h-4 w-4" />
      case "attendance":
        return <Clock className="h-4 w-4" />
      case "emotion":
        return <Brain className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "system":
        return <MapPin className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged)
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical" && !alert.acknowledged)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Security Alerts</span>
          <div className="flex items-center space-x-2">
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalAlerts.length} Critical
              </Badge>
            )}
            <Badge variant="outline">{unacknowledgedAlerts.length} New</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No alerts at this time</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.acknowledged ? "opacity-60" : ""
                  } ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp}</span>
                          </span>
                          {alert.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{alert.location}</span>
                            </span>
                          )}
                          {alert.employee && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{alert.employee}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {alert.type === "emergency" && (
                        <Button size="sm" variant="destructive" className="text-xs">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Call 911
                        </Button>
                      )}
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.acknowledged && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ack'd
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {unacknowledgedAlerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })))}
            >
              Acknowledge All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
