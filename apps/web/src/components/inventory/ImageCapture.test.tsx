import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import ImageCapture from './ImageCapture';
import { createIngredientDetectionModel } from '@nutrition-app/shared/src/ai';

// Mock the AI model
vi.mock('@nutrition-app/shared/src/ai', () => ({
  createIngredientDetectionModel: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    unload: vi.fn().mockResolvedValue(undefined),
    process: vi.fn().mockResolvedValue({
      detectedIngredients: [
        {
          ingredient: {
            id: '1',
            name: 'Apple',
            quantity: 1,
            unit: 'piece',
            category: 'Fruits',
          },
          confidence: 0.95,
          boundingBox: { x: 0, y: 0, width: 100, height: 100 }
        },
        {
          ingredient: {
            id: '2',
            name: 'Banana',
            quantity: 2,
            unit: 'pieces',
            category: 'Fruits',
          },
          confidence: 0.88,
          boundingBox: { x: 100, y: 100, width: 100, height: 100 }
        },
      ],
    }),
  })),
  ImageAnalysisResult: class {},
  DetectedIngredient: class {},
}));

// Mock getUserMedia
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
  writable: true,
});

// Mock createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock for i18n
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations = {
          'inventory.openCamera': 'Take a photo',
          'inventory.selectImage': 'Upload a photo',
          'inventory.capturePhoto': 'Capture',
          'inventory.capturing': 'Capturing...',
          'inventory.analyzeImage': 'Analyze',
          'inventory.analyzing': 'Analyzing...',
          'inventory.confirmIngredients': 'Confirm',
          'inventory.cancelCapture': 'Cancel',
          'inventory.capturedImage': 'Captured image',
          'inventory.noImageSelected': 'No image selected',
          'inventory.scanError': 'Error analyzing image',
          'inventory.ingredientsDetected': 'Ingredients detected'
        };
        return translations[key] || key;
      }
    }),
  };
});

describe('ImageCapture Component', () => {
  const onIngredientsDetected = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<ImageCapture onIngredientsDetected={onIngredientsDetected} />);
    
    // Check if the component rendered
    expect(screen.getByText(/take a photo/i)).toBeInTheDocument();
    expect(screen.getByText(/upload a photo/i)).toBeInTheDocument();
  });

  it('handles camera activation and capture', async () => {
    render(<ImageCapture onIngredientsDetected={onIngredientsDetected} />);
    
    // Click on "Take a Photo" button
    const takePhotoButton = screen.getByText(/take a photo/i);
    fireEvent.click(takePhotoButton);
    
    // Wait for camera to initialize
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
    
    // Mock capturing a photo
    const captureButton = screen.getByText(/capture/i);
    expect(captureButton).toBeInTheDocument();
    
    // Create a mock canvas drawing context
    const mockContext = {
      drawImage: vi.fn(),
      canvas: {
        toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
      },
    };
    
    // Mock getContext method
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);
    
    // Click the capture button
    fireEvent.click(captureButton);
    
    // Check if the analyze button is available
    const analyzeButton = screen.getByText(/analyze/i);
    expect(analyzeButton).toBeInTheDocument();
    
    // Click analyze
    fireEvent.click(analyzeButton);
    
    // Wait for the analysis to complete
    await waitFor(() => {
      expect(onIngredientsDetected).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            ingredient: expect.objectContaining({
              name: 'Apple'
            })
          }),
          expect.objectContaining({
            ingredient: expect.objectContaining({
              name: 'Banana'
            })
          })
        ])
      );
    });
  });

  it('can upload a file and analyze it', async () => {
    render(<ImageCapture onIngredientsDetected={onIngredientsDetected} />);
    
    // Click on "Upload a Photo" button
    const uploadButton = screen.getByText(/upload a photo/i);
    fireEvent.click(uploadButton);
    
    // Mock file input change
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false
    });
    
    fireEvent.change(fileInput);
    
    // Wait for the analyze button to appear
    const analyzeButton = await screen.findByText(/analyze/i);
    expect(analyzeButton).toBeInTheDocument();
    
    // Click analyze
    fireEvent.click(analyzeButton);
    
    // Wait for the analysis to complete
    await waitFor(() => {
      expect(createIngredientDetectionModel).toHaveBeenCalled();
    });
    
    // Check if the ingredients were detected
    await waitFor(() => {
      expect(onIngredientsDetected).toHaveBeenCalled();
    });
  });

  it('can cancel capture and return to options', async () => {
    render(<ImageCapture onIngredientsDetected={onIngredientsDetected} />);
    
    // Click on "Take a Photo" button
    const takePhotoButton = screen.getByText(/take a photo/i);
    fireEvent.click(takePhotoButton);
    
    // Wait for camera to initialize
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
    
    // Find the cancel button
    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
    
    // Click cancel
    fireEvent.click(cancelButton);
    
    // Check if we're back to the options screen
    await waitFor(() => {
      expect(screen.getByText(/take a photo/i)).toBeInTheDocument();
    });
  });
});
