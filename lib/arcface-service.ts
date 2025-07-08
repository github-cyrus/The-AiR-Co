import * as faceapi from 'face-api.js';

export interface FaceDescriptor {
  id: string;
  descriptor: Float32Array;
  name: string;
  confidence: number;
}

export interface RecognitionResult {
  recognized: boolean;
  employeeId?: string;
  name?: string;
  confidence: number;
  distance: number;
}

class ArcFaceService {
  private isInitialized = false;
  private faceDescriptors: Map<string, FaceDescriptor> = new Map();
  private readonly SIMILARITY_THRESHOLD = 0.6; // Lower = more strict matching

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      this.isInitialized = true;
      console.log('ArcFace service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ArcFace service:', error);
      throw error;
    }
  }

  async extractFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<Float32Array | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Detect faces in the image
      const detections = await faceapi.detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return null;
      }

      // Return the descriptor of the first detected face
      return detections[0].descriptor;
    } catch (error) {
      console.error('Error extracting face descriptor:', error);
      return null;
    }
  }

  async trainEmployee(employeeId: string, name: string, imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<boolean> {
    try {
      const descriptor = await this.extractFaceDescriptor(imageElement);
      
      if (!descriptor) {
        throw new Error('No face detected in the training image');
      }

      // Store the face descriptor
      this.faceDescriptors.set(employeeId, {
        id: employeeId,
        descriptor,
        name,
        confidence: 1.0
      });

      console.log(`Trained employee: ${name} (${employeeId})`);
      return true;
    } catch (error) {
      console.error('Error training employee:', error);
      return false;
    }
  }

  async recognizeFace(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<RecognitionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const descriptor = await this.extractFaceDescriptor(imageElement);
      
      if (!descriptor) {
        return {
          recognized: false,
          confidence: 0,
          distance: Infinity
        };
      }

      // Find the best match among trained faces
      let bestMatch: RecognitionResult = {
        recognized: false,
        confidence: 0,
        distance: Infinity
      };

      for (const [employeeId, trainedFace] of this.faceDescriptors) {
        const distance = faceapi.euclideanDistance(descriptor, trainedFace.descriptor);
        const confidence = 1 - distance; // Convert distance to confidence

        if (confidence > bestMatch.confidence && confidence > this.SIMILARITY_THRESHOLD) {
          bestMatch = {
            recognized: true,
            employeeId,
            name: trainedFace.name,
            confidence,
            distance
          };
        }
      }

      return bestMatch;
    } catch (error) {
      console.error('Error recognizing face:', error);
      return {
        recognized: false,
        confidence: 0,
        distance: Infinity
      };
    }
  }

  async validateFaceImage(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<{ valid: boolean; message: string }> {
    try {
      const detections = await faceapi.detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections.length === 0) {
        return { valid: false, message: 'No face detected in the image' };
      }

      if (detections.length > 1) {
        return { valid: false, message: 'Multiple faces detected. Please use an image with only one face' };
      }

      // Check face quality (basic checks)
      const face = detections[0];
      const landmarks = face.landmarks;

      // Check if face is reasonably centered and sized
      const imageWidth = imageElement instanceof HTMLVideoElement ? imageElement.videoWidth : imageElement.width;
      const imageHeight = imageElement instanceof HTMLVideoElement ? imageElement.videoHeight : imageElement.height;
      
      const faceBox = face.detection.box;
      const faceArea = faceBox.width * faceBox.height;
      const imageArea = imageWidth * imageHeight;
      const faceRatio = faceArea / imageArea;

      if (faceRatio < 0.05) {
        return { valid: false, message: 'Face is too small. Please move closer to the camera' };
      }

      if (faceRatio > 0.8) {
        return { valid: false, message: 'Face is too close. Please move back from the camera' };
      }

      return { valid: true, message: 'Face image is valid' };
    } catch (error) {
      console.error('Error validating face image:', error);
      return { valid: false, message: 'Error processing image' };
    }
  }

  getTrainedEmployees(): FaceDescriptor[] {
    return Array.from(this.faceDescriptors.values());
  }

  removeEmployee(employeeId: string): boolean {
    return this.faceDescriptors.delete(employeeId);
  }

  getTrainingStatus(): { isInitialized: boolean; trainedCount: number } {
    return {
      isInitialized: this.isInitialized,
      trainedCount: this.faceDescriptors.size
    };
  }

  async downloadModels(): Promise<void> {
    // This will be handled by the download script
    console.log('Models should be downloaded using the download-models script');
  }
}

// Export singleton instance
export const arcFaceService = new ArcFaceService(); 