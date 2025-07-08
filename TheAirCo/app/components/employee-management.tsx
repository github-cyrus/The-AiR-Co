"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, Camera, Search } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  employeeId: string
  avatar: string
  faceEncoding: string
  status: "active" | "inactive"
  joinDate: string
  lastSeen: string
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      position: "Senior Developer",
      employeeId: "EMP001",
      avatar: "/placeholder.svg?height=40&width=40",
      faceEncoding: "encoded_face_data_1",
      status: "active",
      joinDate: "2023-01-15",
      lastSeen: "2024-01-04 09:30:00",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      employeeId: "EMP002",
      avatar: "/placeholder.svg?height=40&width=40",
      faceEncoding: "encoded_face_data_2",
      status: "active",
      joinDate: "2023-02-20",
      lastSeen: "2024-01-04 10:15:00",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      department: "Sales",
      position: "Sales Representative",
      employeeId: "EMP003",
      avatar: "/placeholder.svg?height=40&width=40",
      faceEncoding: "encoded_face_data_3",
      status: "active",
      joinDate: "2023-03-10",
      lastSeen: "2024-01-04 08:45:00",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    employeeId: "",
    avatar: "",
  })

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      faceEncoding: "pending_training",
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastSeen: "Never",
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      employeeId: "",
      avatar: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const FaceTrainingCard = ({ employee }: { employee: Employee }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div>{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.employeeId}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Upload Face Photos</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Upload 5-10 clear photos of the employee's face</p>
              </div>
            </div>
            <div>
              <Label>Live Capture</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Capture photos using webcam</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Start Training</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Test Recognition
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Employee Management</span>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Add a new employee to the recognition system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={newEmployee.employeeId}
                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                        placeholder="Enter employee ID"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                        placeholder="Enter department"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        placeholder="Enter position"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEmployee}>Add Employee</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Employee List</TabsTrigger>
              <TabsTrigger value="training">Face Training</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.lastSeen}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Train the face recognition system for each employee to improve accuracy
              </div>
              {employees.map((employee) => (
                <FaceTrainingCard key={employee.id} employee={employee} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
