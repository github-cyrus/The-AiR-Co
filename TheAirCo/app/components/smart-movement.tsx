"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Map, 
  Users, 
  Clock, 
  TrendingUp,
  RefreshCw,
  Activity,
  Target
} from 'lucide-react'
import { theAirCoService, type MovementRecord, type Employee } from '@/lib/surveillance-service'
import moment from 'moment'

interface SmartMovementProps {
  expanded?: boolean
}

export default function SmartMovement({ expanded = false }: SmartMovementProps) {
  const [movementRecords, setMovementRecords] = useState<MovementRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [zones, setZones] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Load data
  useEffect(() => {
    loadMovementData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadMovementData()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const loadMovementData = () => {
    setIsLoading(true)
    try {
      const records = theAirCoService.getMovementRecords()
      const employeeList = theAirCoService.getEmployees()
      const zoneData = theAirCoService.getZones()

      setMovementRecords(records)
      setEmployees(employeeList)
      setZones(zoneData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading movement data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getZoneStats = () => {
    const stats: { [key: string]: { name: string; count: number; lastActivity: Date | null } } = {}
    
    // Initialize stats for all zones
    Object.keys(zones).forEach(zoneKey => {
      stats[zoneKey] = {
        name: zones[zoneKey].name,
        count: 0,
        lastActivity: null
      }
    })

    // Count current occupants and last activity
    movementRecords.forEach(record => {
      if (stats[record.zone]) {
        if (record.action === 'entered') {
          stats[record.zone].count++
        } else if (record.action === 'exited') {
          stats[record.zone].count = Math.max(0, stats[record.zone].count - 1)
        }
        
        if (!stats[record.zone].lastActivity || record.timestamp > stats[record.zone].lastActivity) {
          stats[record.zone].lastActivity = record.timestamp
        }
      }
    })

    return stats
  }

  const getEmployeeCurrentZone = (employeeId: string): string | null => {
    const employeeMovements = movementRecords
      .filter(record => record.employeeId === employeeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (employeeMovements.length === 0) return null

    // Find the last movement and determine current zone
    let currentZone = null
    for (const movement of employeeMovements) {
      if (movement.action === 'entered') {
        currentZone = movement.zone
        break
      } else if (movement.action === 'exited') {
        currentZone = null
        break
      }
    }

    return currentZone
  }

  const getRecentMovements = () => {
    return movementRecords
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  }

  const zoneStats = getZoneStats()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5" />
            <CardTitle>Movement Tracking</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {moment(lastUpdate).format('HH:mm:ss')}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={loadMovementData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(zoneStats).map(([zoneKey, stats]) => (
            <Card key={zoneKey} className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">{stats.name}</p>
                <p className="text-xl font-bold text-blue-600">{stats.count}</p>
                <p className="text-xs text-gray-500">
                  {stats.lastActivity ? moment(stats.lastActivity).fromNow() : 'No activity'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Office Layout Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Office Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg p-4 min-h-[400px]">
              {/* Simplified office layout visualization */}
              <div className="grid grid-cols-6 gap-2 h-full">
                {/* Entrance */}
                <div className="col-span-1 bg-blue-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Entrance</div>
                  <div className="text-blue-600 font-bold">{zoneStats.entrance?.count || 0}</div>
                </div>
                
                {/* Reception */}
                <div className="col-span-2 bg-green-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Reception</div>
                  <div className="text-green-600 font-bold">{zoneStats.reception?.count || 0}</div>
                </div>
                
                {/* Cabin 1 */}
                <div className="col-span-1 bg-purple-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Cabin 1</div>
                  <div className="text-purple-600 font-bold">{zoneStats['cabin-1']?.count || 0}</div>
                </div>
                
                {/* Cabin 2 */}
                <div className="col-span-1 bg-purple-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Cabin 2</div>
                  <div className="text-purple-600 font-bold">{zoneStats['cabin-2']?.count || 0}</div>
                </div>
                
                {/* Break Area */}
                <div className="col-span-2 bg-yellow-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Break Area</div>
                  <div className="text-yellow-600 font-bold">{zoneStats['break-area']?.count || 0}</div>
                </div>
                
                {/* Meeting Room */}
                <div className="col-span-2 bg-orange-200 rounded p-2 text-center text-xs">
                  <div className="font-medium">Meeting Room</div>
                  <div className="text-orange-600 font-bold">{zoneStats['meeting-room']?.count || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Location Table */}
        {expanded && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Current Zone</TableHead>
                    <TableHead>Last Movement</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const currentZone = getEmployeeCurrentZone(employee.id)
                    const lastMovement = movementRecords
                      .filter(record => record.employeeId === employee.id)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span>{employee.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          {currentZone ? (
                            <Badge variant="outline" className="bg-blue-50">
                              {zones[currentZone]?.name || currentZone}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not in office</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {lastMovement ? (
                            <div>
                              <div className="text-sm">{moment(lastMovement.timestamp).format('HH:mm:ss')}</div>
                              <div className="text-xs text-gray-500">
                                {lastMovement.action} {zones[lastMovement.zone]?.name || lastMovement.zone}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">No movement</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={currentZone ? "default" : "secondary"}>
                            {currentZone ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Movements */}
        {!expanded && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentMovements().map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{movement.employeeName}</p>
                        <p className="text-sm text-gray-500">
                          {movement.action} {zones[movement.zone]?.name || movement.zone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {moment(movement.timestamp).format('HH:mm:ss')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {moment(movement.timestamp).format('MMM DD')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Movement Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Employees</span>
              </div>
              <p className="text-lg font-bold mt-1">
                {employees.filter(emp => getEmployeeCurrentZone(emp.id)).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total Movements</span>
              </div>
              <p className="text-lg font-bold mt-1">{movementRecords.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Most Active Zone</span>
              </div>
              <p className="text-lg font-bold mt-1">
                {Object.entries(zoneStats).reduce((max, [key, stats]) => 
                  stats.count > max.count ? { key, ...stats } : max, 
                  { key: '', count: 0, name: 'None' }
                ).name}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
} 