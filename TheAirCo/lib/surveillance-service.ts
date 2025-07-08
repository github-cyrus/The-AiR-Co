import { arcFaceService, type RecognitionResult } from './arcface-service';
import { db, storage } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  employeeId: string;
  faceDescriptor?: Float32Array;
  faceImages?: string[];
  imageUrl?: string;
  isActive: boolean;
  registeredAt: Date;
  lastSeen?: Date;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'left-early';
}

export interface MovementRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  zone: string;
  timestamp: Date;
  action: 'entered' | 'exited';
}

export interface Alert {
  id: string;
  type: 'unknown-person' | 'unauthorized-access' | 'system-error';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  imageUrl?: string;
  isResolved: boolean;
}

export interface DetectionResult {
  face: any; // Simplified for compatibility
  descriptor?: Float32Array;
  employee?: Employee;
  confidence: number;
  isUnknown: boolean;
  recognitionResult?: RecognitionResult;
}

class TheAirCoService {
  private employees: Map<string, Employee> = new Map();
  private attendanceRecords: Map<string, AttendanceRecord> = new Map();
  private movementRecords: MovementRecord[] = [];
  private alerts: Alert[] = [];
  private isInitialized = false;
  private isActive = false;
  private detectionInterval?: NodeJS.Timeout;

  // Office zones for movement tracking
  private zones = {
    'entrance': { name: 'Main Entrance', coordinates: { x: 0, y: 0, width: 100, height: 50 } },
    'reception': { name: 'Reception Area', coordinates: { x: 100, y: 0, width: 200, height: 100 } },
    'cabin-1': { name: 'Cabin 1', coordinates: { x: 300, y: 0, width: 150, height: 100 } },
    'cabin-2': { name: 'Cabin 2', coordinates: { x: 450, y: 0, width: 150, height: 100 } },
    'break-area': { name: 'Break Area', coordinates: { x: 100, y: 100, width: 200, height: 100 } },
    'meeting-room': { name: 'Meeting Room', coordinates: { x: 300, y: 100, width: 200, height: 100 } },
  };

  async initialize(): Promise<void> {
    try {
      // Initialize ArcFace service
      await arcFaceService.initialize();

      // Load sample employees (in real implementation, this would come from database)
      await this.loadSampleEmployees();

      this.isInitialized = true;
      console.log('TheAirCo system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TheAirCo system:', error);
      throw error;
    }
  }

  private async loadSampleEmployees(): Promise<void> {
    // No sample employees - start with empty database
    console.log('Employee database initialized - no sample data loaded');
  }

  async startTheAirCo(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('TheAirCo system not initialized');
    }

    this.isActive = true;
    console.log('TheAirCo system started');
    
    // Start periodic detection (in real implementation, this would be continuous video processing)
    this.detectionInterval = setInterval(() => {
      this.processDetection();
    }, 1000); // Process every second
  }

  async stopTheAirCo(): Promise<void> {
    this.isActive = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
    console.log('TheAirCo system stopped');
  }

  private async processDetection(): Promise<void> {
    if (!this.isActive) return;

    // Simulate face detection and recognition
    // In real implementation, this would process actual video frames
    const detectionResults = await this.simulateDetection();
    
    for (const result of detectionResults) {
      await this.handleDetection(result);
    }
  }

  private async simulateDetection(): Promise<DetectionResult[]> {
    // This method will be replaced with real detection in the camera component
    // For now, return empty results as real detection will be handled by ArcFace
    return [];
  }

  private async handleDetection(result: DetectionResult): Promise<void> {
    if (result.isUnknown) {
      await this.handleUnknownPerson(result);
    } else if (result.employee) {
      await this.handleKnownEmployee(result);
    }
  }

  private async handleUnknownPerson(result: DetectionResult): Promise<void> {
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      type: 'unknown-person',
      message: 'Unknown person detected in office premises',
      timestamp: new Date(),
      severity: 'high',
      location: 'Main Entrance',
      isResolved: false,
    };

    this.alerts.push(alert);
    console.log('Alert: Unknown person detected');
  }

  async handleKnownEmployee(result: DetectionResult): Promise<void> {
    if (!result.employee) return;

    const employee = result.employee;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if employee already has attendance record for today
    const attendanceKey = `${employee.id}_${today.toISOString().split('T')[0]}`;
    let attendanceRecord = this.attendanceRecords.get(attendanceKey);

    if (!attendanceRecord) {
      // Create new attendance record
      attendanceRecord = {
        id: attendanceKey,
        employeeId: employee.id,
        employeeName: employee.name,
        checkIn: now,
        status: 'present',
      };
      this.attendanceRecords.set(attendanceKey, attendanceRecord);
      console.log(`Employee ${employee.name} checked in at ${now.toLocaleTimeString()}`);
    }

    // Record movement
    const movementRecord: MovementRecord = {
      id: `movement_${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      zone: 'main-area',
      timestamp: now,
      action: 'entered',
    };
    this.movementRecords.push(movementRecord);
  }

  async handleUnknownPerson(result: DetectionResult): Promise<void> {
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      type: 'unknown-person',
      message: 'Unknown person detected in office premises',
      timestamp: new Date(),
      severity: 'high',
      location: 'Main Entrance',
      isResolved: false,
    };

    this.alerts.push(alert);
    console.log('Alert: Unknown person detected');
  }

  // Public methods for UI components
  getEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }

  getAttendanceRecords(): AttendanceRecord[] {
    return Array.from(this.attendanceRecords.values());
  }

  getMovementRecords(): MovementRecord[] {
    return this.movementRecords;
  }

  getAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.isResolved);
  }

  getSystemStatus(): { isActive: boolean; isInitialized: boolean } {
    return {
      isActive: this.isActive,
      isInitialized: this.isInitialized,
    };
  }

  getZones() {
    return this.zones;
  }

  // Register new employee with face training
  async registerEmployee(employeeData: {
    name: string;
    email: string;
    department: string;
    phone?: string;
    employeeId: string;
    faceImages: string[];
    isActive: boolean;
  }): Promise<Employee> {
    // Check if employee ID or email already exists in Firestore
    const employeesRef = collection(db, 'employees');
    const idQuery = query(employeesRef, where('employeeId', '==', employeeData.employeeId));
    const emailQuery = query(employeesRef, where('email', '==', employeeData.email));
    const [idSnapshot, emailSnapshot] = await Promise.all([
      getDocs(idQuery),
      getDocs(emailQuery)
    ]);
    if (!idSnapshot.empty) {
      throw new Error('Employee ID already exists');
    }
    if (!emailSnapshot.empty) {
      throw new Error('Email already registered');
    }

    // Upload face images to Firebase Storage and get URLs
    const imageUrls: string[] = [];
    for (let i = 0; i < employeeData.faceImages.length; i++) {
      const base64 = employeeData.faceImages[i];
      const imageRef = ref(storage, `employees/${employeeData.employeeId}/face_${i + 1}.jpg`);
      await uploadString(imageRef, base64, 'data_url');
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    // Generate face descriptor from captured images (local logic)
    const faceDescriptor = await this.generateFaceDescriptor(employeeData.faceImages);

    // Create employee object
    const newEmployee: Employee = {
      id: '', // Firestore will generate this
      name: employeeData.name,
      email: employeeData.email,
      department: employeeData.department,
      phone: employeeData.phone,
      employeeId: employeeData.employeeId,
      faceDescriptor,
      faceImages: imageUrls,
      isActive: employeeData.isActive,
      registeredAt: new Date(),
    };

    // Store employee in Firestore
    const docRef = await addDoc(employeesRef, {
      ...newEmployee,
      registeredAt: new Date(),
      faceDescriptor: Array.from(faceDescriptor || []), // Firestore doesn't support Float32Array
    });
    newEmployee.id = docRef.id;

    // Optionally, keep in local map for compatibility
    this.employees.set(newEmployee.id, newEmployee);
    console.log(`Employee ${employeeData.name} registered successfully with ID: ${newEmployee.id}`);
    return newEmployee;
  }

  // Generate face descriptor from captured images using ArcFace
  private async generateFaceDescriptor(faceImages: string[]): Promise<Float32Array> {
    try {
      // Use ArcFace service to train the employee's face
      const employeeId = `emp${String(this.employees.size + 1).padStart(3, '0')}`;
      const descriptor = await arcFaceService.trainEmployeeFace(employeeId, faceImages);
      return descriptor;
    } catch (error) {
      console.error('Error generating face descriptor:', error);
      throw new Error('Failed to process face images. Please ensure clear face photos are provided.');
    }
  }

  // Resolve alert
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isResolved = true;
    }
  }

  // Get attendance summary
  getAttendanceSummary(): {
    present: number;
    absent: number;
    late: number;
    total: number;
  } {
    const records = this.getAttendanceRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => 
      r.checkIn.toISOString().split('T')[0] === today
    );

    return {
      present: todayRecords.filter(r => r.status === 'present').length,
      absent: todayRecords.filter(r => r.status === 'absent').length,
      late: todayRecords.filter(r => r.status === 'late').length,
      total: this.employees.size,
    };
  }
}

// Export singleton instance
export const theAirCoService = new TheAirCoService(); 