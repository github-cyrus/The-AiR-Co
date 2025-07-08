"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Building,
  Plus,
  Camera,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import EmployeeRegistration from "./employee-registration"
import { theAirCoService, type Employee } from "@/lib/surveillance-service"
import moment from 'moment'

export default function SmartEmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load employees from TheAirCo service
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = () => {
    setIsLoading(true)
    try {
      const employeeList = theAirCoService.getEmployees()
      setEmployees(employeeList)
    } catch (error) {
      console.error('Error loading employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeeRegistered = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee])
    setShowRegistration(false)
  }

  const handleDeleteEmployee = (employeeId: string) => {
    // In a real implementation, this would call the TheAirCo service
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
  }

  const handleToggleEmployeeStatus = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, isActive: !emp.isActive }
        : emp
    ))
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const getFaceTrainingStatus = (employee: Employee) => {
    if (employee.faceImages && employee.faceImages.length > 0) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <Camera className="h-3 w-3 mr-1" />
          Trained ({employee.faceImages.length} images)
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Not Trained
        </Badge>
      )
    }
  }

  if (showRegistration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Employee Registration</h2>
          <Button
            variant="outline"
            onClick={() => setShowRegistration(false)}
          >
            Back to Management
          </Button>
        </div>
        <EmployeeRegistration
          onComplete={handleEmployeeRegistered}
          onBack={() => setShowRegistration(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Employee Management</CardTitle>
            </div>
            <Button
              onClick={() => setShowRegistration(true)}
              className="flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register New Employee</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-600">Total Employees</p>
              <p className="text-lg font-bold text-blue-600">{employees.length}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs text-gray-600">Active</p>
              <p className="text-lg font-bold text-green-600">
                {employees.filter(emp => emp.isActive).length}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Camera className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-600">Face Trained</p>
              <p className="text-lg font-bold text-purple-600">
                {employees.filter(emp => emp.faceImages && emp.faceImages.length > 0).length}
              </p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-1 text-orange-600" />
              <p className="text-xs text-gray-600">Recently Added</p>
              <p className="text-lg font-bold text-orange-600">
                {employees.filter(emp => 
                  moment(emp.registeredAt).isAfter(moment().subtract(7, 'days'))
                ).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees by name, email, department, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={loadEmployees}
              disabled={isLoading}
            >
              <span>Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {searchTerm ? 'No employees found matching your search.' : 'No employees registered yet.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowRegistration(true)}
                  className="mt-4"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register First Employee
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Face Training</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={employee.imageUrl} />
                          <AvatarFallback>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{employee.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getFaceTrainingStatus(employee)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(employee.isActive)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {moment(employee.registeredAt).format('MMM DD, YYYY')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleEmployeeStatus(employee.id)}
                        >
                          {employee.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employee Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span>{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span>{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedEmployee.email}</span>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">System Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedEmployee.isActive)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Face Training:</span>
                      {getFaceTrainingStatus(selectedEmployee)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered:</span>
                      <span>{moment(selectedEmployee.registeredAt).format('MMM DD, YYYY HH:mm')}</span>
                    </div>
                    {selectedEmployee.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Seen:</span>
                        <span>{moment(selectedEmployee.lastSeen).format('MMM DD, YYYY HH:mm')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEmployee.faceImages && selectedEmployee.faceImages.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Face Training Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedEmployee.faceImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Training image ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 