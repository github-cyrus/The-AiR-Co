"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react'
import { theAirCoService, type AttendanceRecord, type Employee } from '@/lib/surveillance-service'
import moment from 'moment'

interface SmartAttendanceProps {
  expanded?: boolean
}

export default function SmartAttendance({ expanded = false }: SmartAttendanceProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Load data
  useEffect(() => {
    loadAttendanceData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadAttendanceData()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const loadAttendanceData = () => {
    setIsLoading(true)
    try {
      const records = theAirCoService.getAttendanceRecords()
      const employeeList = theAirCoService.getEmployees()
      const summary = theAirCoService.getAttendanceSummary()

      setAttendanceRecords(records)
      setEmployees(employeeList)
      setAttendanceSummary(summary)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading attendance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEmployeeStatus = (employeeId: string): AttendanceRecord | null => {
    const today = new Date().toISOString().split('T')[0]
    return attendanceRecords.find(record => 
      record.employeeId === employeeId && 
      record.checkIn.toISOString().split('T')[0] === today
    ) || null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Late</Badge>
      case 'left-early':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Left Early</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getAttendancePercentage = () => {
    if (attendanceSummary.total === 0) return 0
    return Math.round((attendanceSummary.present / attendanceSummary.total) * 100)
  }

  const getWorkingHours = (record: AttendanceRecord) => {
    if (!record.checkOut) return 'Still Working'
    
    const duration = moment.duration(moment(record.checkOut).diff(moment(record.checkIn)))
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>Smart Attendance System</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {moment(lastUpdate).format('HH:mm:ss')}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={loadAttendanceData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{attendanceSummary.late}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{attendanceSummary.total}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Attendance Rate</span>
              <span className="text-sm text-gray-500">{getAttendancePercentage()}%</span>
            </div>
            <Progress value={getAttendancePercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Employee Attendance Table */}
        {expanded && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Attendance - {moment().format('MMMM DD, YYYY')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const attendance = getEmployeeStatus(employee.id)
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
                          {attendance ? getStatusBadge(attendance.status) : <Badge variant="secondary">Not Checked In</Badge>}
                        </TableCell>
                        <TableCell>
                          {attendance ? moment(attendance.checkIn).format('HH:mm:ss') : '-'}
                        </TableCell>
                        <TableCell>
                          {attendance?.checkOut ? moment(attendance.checkOut).format('HH:mm:ss') : '-'}
                        </TableCell>
                        <TableCell>
                          {attendance ? getWorkingHours(attendance) : '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Check-ins */}
        {!expanded && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords
                  .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
                  .slice(0, 5)
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-gray-500">
                            Checked in at {moment(record.checkIn).format('HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(record.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {moment(record.checkIn).format('MMM DD')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Average Check-in Time</span>
              </div>
              <p className="text-lg font-bold mt-1">08:45 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Today's Attendance</span>
              </div>
              <p className="text-lg font-bold mt-1">{getAttendancePercentage()}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Weekly Average</span>
              </div>
              <p className="text-lg font-bold mt-1">94.2%</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
} 