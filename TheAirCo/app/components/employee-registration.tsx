"use client"

import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Camera, 
  Save, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { theAirCoService, type Employee } from '@/lib/surveillance-service'
import { arcFaceService } from '@/lib/arcface-service'

interface EmployeeRegistrationProps {
  onComplete?: (employee: Employee) => void
  onBack?: () => void
}

export default function EmployeeRegistration({ onComplete, onBack }: EmployeeRegistrationProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    employeeId: ''
  })

  // Face training
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  
  const webcamRef = useRef<Webcam>(null)

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'IT Support',
    'Management'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.department) {
      setError('Department is required')
      return false
    }
    if (!formData.employeeId.trim()) {
      setError('Employee ID is required')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    setStep(step + 1)
    setError(null)
  }

  const handleBack = () => {
    if (step === 1 && onBack) {
      onBack()
    } else {
      setStep(step - 1)
      setError(null)
    }
  }

  const captureImage = useCallback(() => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setCapturedImages(prev => [...prev, imageSrc])
      setSuccess(`Image ${capturedImages.length + 1} captured successfully!`)
      setTimeout(() => setSuccess(null), 2000)
    }
  }, [capturedImages.length])

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index))
  }

  const startTraining = async () => {
    if (capturedImages.length < 3) {
      setError('Please capture at least 3 images for training')
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)
    setError(null)

    try {
      // Real face training with ArcFace
      setTrainingProgress(20)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Validate that faces are detected in captured images
      for (let i = 0; i < capturedImages.length; i++) {
        const descriptor = await arcFaceService.extractFaceDescriptorFromBase64(capturedImages[i])
        if (!descriptor) {
          throw new Error(`No face detected in image ${i + 1}. Please ensure clear face photos.`)
        }
        setTrainingProgress(20 + ((i + 1) / capturedImages.length) * 60)
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      setTrainingProgress(80)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create employee with face data
      const employeeData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        phone: formData.phone,
        employeeId: formData.employeeId,
        faceImages: capturedImages,
        isActive: true
      }

      const newEmployee = await theAirCoService.registerEmployee(employeeData)
      
      setTrainingProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSuccess('Employee registered successfully! Face training completed.')
      setTimeout(() => {
        if (onComplete) {
          onComplete(newEmployee)
        }
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register employee. Please try again.')
    } finally {
      setIsTraining(false)
    }
  }

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <CardTitle>Employee Registration</CardTitle>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded ${step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
            Step 1: Basic Info
          </span>
          <ArrowRight className="h-4 w-4" />
          <span className={`px-2 py-1 rounded ${step >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
            Step 2: Face Training
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="Enter employee ID"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Face Training */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Face Training</h3>
              <p className="text-sm text-gray-600">
                Please capture multiple images of your face from different angles for better recognition accuracy.
              </p>
            </div>

            {/* Camera Feed */}
            <div className="relative">
              <div className="bg-black rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  videoConstraints={videoConstraints}
                  className="w-full h-auto"
                />
                {isCapturing && (
                  <div className="absolute inset-0 bg-green-500/20 border-4 border-green-500 rounded-lg flex items-center justify-center">
                    <div className="text-white text-lg font-bold">Capturing...</div>
                  </div>
                )}
              </div>
            </div>

            {/* Capture Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={captureImage}
                disabled={capturedImages.length >= 5}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Capture Image ({capturedImages.length}/5)</span>
              </Button>
            </div>

            {/* Captured Images */}
            {capturedImages.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Captured Images:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Capture ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Progress */}
            {isTraining && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training Face Recognition Model...</span>
                  <span className="text-sm text-gray-500">{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isTraining}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? 'Back' : 'Previous'}
          </Button>

          {step === 1 ? (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={startTraining}
              disabled={isTraining || capturedImages.length < 3}
              className="flex items-center space-x-2"
            >
              {isTraining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Training...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Complete Registration</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 