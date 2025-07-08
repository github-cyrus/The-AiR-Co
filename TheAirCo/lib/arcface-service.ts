import * as tf from '@tensorflow/tfjs'
import * as faceapi from 'face-api.js'

export interface FaceDescriptor {
  descriptor: Float32Array
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface RecognitionResult {
  employeeId: string
  employeeName: string
  confidence: number
  distance: number
  isMatch: boolean
}

class ArcFaceService {
  private isInitialized = false
  private faceMatcher: faceapi.FaceMatcher | null = null
  private employeeDescriptors: Map<string, Float32Array> = new Map()
  private recognitionThreshold = 0.6 // Lower = more strict matching

  async initialize(): Promise<void> {
    try {
      // Set TensorFlow backend
      await tf.setBackend('webgl')
      await tf.ready()

      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      await faceapi.nets.faceExpressionNet.loadFromUri('/models')

      this.isInitialized = true
      console.log('ArcFace service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize ArcFace service:', error)
      throw error
    }
  }

  // Extract face descriptor from image
  async extractFaceDescriptor(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<FaceDescriptor | null> {
    if (!this.isInitialized) {
      throw new Error('ArcFace service not initialized')
    }

    try {
      // Detect faces in the image
      const detections = await faceapi.detectAllFaces(
        imageElement,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416, // larger size for better accuracy
          scoreThreshold: 0.2, // lower threshold for more sensitivity
          minConfidence: 0.2 // lower confidence for more sensitivity
        })
      )
        .withFaceLandmarks()
        .withFaceDescriptors()

      if (detections.length === 0) {
        return null
      }

      // Get the largest face (most likely the main subject)
      const largestFace = detections.reduce((largest, current) => {
        const currentArea = current.detection.box.width * current.detection.box.height
        const largestArea = largest.detection.box.width * largest.detection.box.height
        return currentArea > largestArea ? current : largest
      })

      return {
        descriptor: largestFace.descriptor,
        confidence: largestFace.detection.score,
        boundingBox: {
          x: largestFace.detection.box.x,
          y: largestFace.detection.box.y,
          width: largestFace.detection.box.width,
          height: largestFace.detection.box.height
        }
      }
    } catch (error) {
      console.error('Error extracting face descriptor:', error)
      return null
    }
  }

  // Utility: Resize image to 256x256 using a canvas
  private async resizeImageTo256(base64Image: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0, 256, 256);
        resolve(canvas);
      };
      img.onerror = (err) => reject(err);
      img.src = base64Image;
    });
  }

  // Extract face descriptor from base64 image (with resizing)
  async extractFaceDescriptorFromBase64(base64Image: string): Promise<FaceDescriptor | null> {
    try {
      const canvas = await this.resizeImageTo256(base64Image);
      // Log canvas size for debugging
      if (canvas.width !== 256 || canvas.height !== 256) {
        console.error('Canvas size mismatch:', canvas.width, canvas.height);
      }
      return await this.extractFaceDescriptor(canvas);
    } catch (err) {
      console.error('Error resizing or extracting descriptor from base64 image:', err);
      return null;
    }
  }

  // Train employee face recognition
  async trainEmployeeFace(employeeId: string, faceImages: string[]): Promise<Float32Array> {
    if (!this.isInitialized) {
      throw new Error('ArcFace service not initialized')
    }

    const descriptors: Float32Array[] = []

    for (let i = 0; i < faceImages.length; i++) {
      const descriptor = await this.extractFaceDescriptorFromBase64(faceImages[i])
      if (descriptor && descriptor.descriptor && descriptor.descriptor.length > 0) {
        descriptors.push(descriptor.descriptor)
        console.log(`Descriptor length for image ${i + 1}:`, descriptor.descriptor.length)
      } else {
        // Immediately abort if any image fails
        throw new Error(`No face detected in image ${i + 1}. Please ensure clear face photos.`)
      }
    }

    if (descriptors.length === 0) {
      throw new Error('No valid faces found in training images')
    }

    // Ensure all descriptors are the same length
    const expectedLength = descriptors[0].length
    for (let i = 0; i < descriptors.length; i++) {
      if (descriptors[i].length !== expectedLength) {
        throw new Error(`Descriptor length mismatch at image ${i + 1}: expected ${expectedLength}, got ${descriptors[i].length}`)
      }
    }

    const averageDescriptor = this.calculateAverageDescriptor(descriptors)
    this.employeeDescriptors.set(employeeId, averageDescriptor)
    await this.updateFaceMatcher()
    console.log(`Trained face recognition for employee ${employeeId} with ${descriptors.length} images`)
    return averageDescriptor
  }

  // Calculate average descriptor from multiple face descriptors
  private calculateAverageDescriptor(descriptors: Float32Array[]): Float32Array {
    const length = descriptors[0].length
    const average = new Float32Array(length)

    for (let i = 0; i < length; i++) {
      let sum = 0
      for (const descriptor of descriptors) {
        sum += descriptor[i]
      }
      average[i] = sum / descriptors.length
    }

    return average
  }

  // Update face matcher with current employee descriptors
  private async updateFaceMatcher(): Promise<void> {
    const labeledDescriptors: faceapi.LabeledFaceDescriptors[] = []

    for (const [employeeId, descriptor] of this.employeeDescriptors) {
      labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(employeeId, [descriptor]))
    }

    this.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, this.recognitionThreshold)
  }

  // Recognize face in real-time
  async recognizeFace(imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Promise<RecognitionResult | null> {
    if (!this.isInitialized || !this.faceMatcher) {
      return null
    }

    try {
      // Detect and extract face descriptor
      const faceDescriptor = await this.extractFaceDescriptor(imageElement)
      if (!faceDescriptor) {
        return null
      }

      // Match against known faces
      const match = this.faceMatcher.findBestMatch(faceDescriptor.descriptor)

      if (match.distance < this.recognitionThreshold) {
        // Extract employee name from the match label
        const employeeName = this.getEmployeeNameFromId(match.label)
        
        return {
          employeeId: match.label,
          employeeName: employeeName,
          confidence: 1 - match.distance, // Convert distance to confidence
          distance: match.distance,
          isMatch: true
        }
      } else {
        return {
          employeeId: '',
          employeeName: 'Unknown',
          confidence: 1 - match.distance,
          distance: match.distance,
          isMatch: false
        }
      }
    } catch (error) {
      console.error('Error recognizing face:', error)
      return null
    }
  }

  // Recognize face from base64 image
  async recognizeFaceFromBase64(base64Image: string): Promise<RecognitionResult | null> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = async () => {
        const result = await this.recognizeFace(img)
        resolve(result)
      }
      img.onerror = () => {
        console.error('Failed to load image from base64')
        resolve(null)
      }
      img.src = base64Image
    })
  }

  // Get employee name from ID (this would typically come from a database)
  private getEmployeeNameFromId(employeeId: string): string {
    // This is a placeholder - in real implementation, this would query the database
    return employeeId // For now, just return the ID
  }

  // Remove employee from recognition system
  removeEmployee(employeeId: string): void {
    this.employeeDescriptors.delete(employeeId)
    this.updateFaceMatcher()
  }

  // Get recognition statistics
  getRecognitionStats(): {
    totalEmployees: number
    isInitialized: boolean
    threshold: number
  } {
    return {
      totalEmployees: this.employeeDescriptors.size,
      isInitialized: this.isInitialized,
      threshold: this.recognitionThreshold
    }
  }

  // Set recognition threshold
  setRecognitionThreshold(threshold: number): void {
    this.recognitionThreshold = Math.max(0, Math.min(1, threshold))
    if (this.faceMatcher) {
      this.updateFaceMatcher()
    }
  }

  // Get employee descriptor
  getEmployeeDescriptor(employeeId: string): Float32Array | undefined {
    return this.employeeDescriptors.get(employeeId)
  }

  // Check if employee is trained
  isEmployeeTrained(employeeId: string): boolean {
    return this.employeeDescriptors.has(employeeId)
  }
}

// Export singleton instance
export const arcFaceService = new ArcFaceService() 