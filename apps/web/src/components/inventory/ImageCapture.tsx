/**
 * Image Capture Component
 * 
 * Allows users to capture images using their device camera or select images from their file system
 * for ingredient detection.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  IIngredientDetectionService 
} from '@nutrition-app/shared/src/core/domain/services/IIngredientDetectionService';
import { 
  createIngredientDetectionService 
} from '@nutrition-app/shared/src/infrastructure/services/IngredientDetectionService';
import {
  DetectedIngredient
} from '@nutrition-app/shared/src/core/models/ingredient';
import {
  ImageAnalysisResult
} from '@nutrition-app/shared/src/core/models/ai';

// Styled Components
const CaptureContainer = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CaptureHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CapturePreview = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PreviewPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  svg {
    font-size: 48px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const CaptureControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const DetectionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const BoundingBox = styled.div<{ box: { x: number, y: number, width: number, height: number } }>`
  position: absolute;
  left: ${props => props.box.x}px;
  top: ${props => props.box.y}px;
  width: ${props => props.box.width}px;
  height: ${props => props.box.height}px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  
  &::after {
    content: attr(data-label);
    position: absolute;
    top: -24px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }
`;

const ResultsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ResultsTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const IngredientInfo = styled.div`
  display: flex;
  align-items: center;
`;

const IngredientName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const IngredientConfidence = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IngredientActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface Props {
  onIngredientsIdentified: (ingredients: DetectedIngredient[]) => void;
  onClose: () => void;
}

/**
 * Image Capture Component
 */
const ImageCapture: React.FC<Props> = ({ onIngredientsIdentified, onClose }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<DetectedIngredient[]>([]);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult | null>(null);
  
  // Initialize detection service
  const [detectionService] = useState<IIngredientDetectionService>(() => createIngredientDetectionService());
  
  // Preload model in background
  useEffect(() => {
    const preloadModel = async () => {
      try {
        await detectionService.loadModel();
        console.log('Ingredient detection model preloaded successfully');
      } catch (error) {
        console.error('Failed to preload ingredient detection model:', error);
      }
    };
    
    preloadModel();
  }, [detectionService]);
  
  // Start camera
  const startCamera = async () => {
    if (videoRef.current && !cameraActive) {
      setCameraStarting(true);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Prefer back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        // Connect stream to video element
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
      } finally {
        setCameraStarting(false);
      }
    }
  };
  
  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      // Stop all tracks in the stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      
      // Clear source
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop camera stream on unmount
      stopCamera();
    };
  }, [stopCamera]);
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSource(result);
        
        // Stop camera if running
        if (cameraActive) {
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open file selector
  const handleOpenFileSelector = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  // Capture image from camera
  const handleCaptureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setImageSource(imageDataUrl);
        setCameraActive(false);
      }
      
      setIsCapturing(false);
    }
  }, []);
  
  // Analyze the image for ingredients
  const analyzeImage = useCallback(async () => {
    if (!imageSource) return;
    
    try {
      setIsAnalyzing(true);
      
      // Create an image element for the AI model
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSource;
      
      // Wait for image to load
      await new Promise<void>((resolve) => {
        image.onload = () => resolve();
      });
      
      // Analyze the image
      const results = await detectionService.detectIngredientsInImage(image);
      
      // Update state with analysis results
      setAnalysisResults(results);
      
      // Pre-select all detected ingredients
      setSelectedIngredients(results.ingredients);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Handle error
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSource, detectionService]);
  
  // Toggle ingredient selection
  const toggleIngredientSelection = (ingredient: DetectedIngredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.some(i => i.name === ingredient.name);
      
      if (isSelected) {
        return prev.filter(i => i.name !== ingredient.name);
      } else {
        return [...prev, ingredient];
      }
    });
  };
  
  // Confirm selected ingredients
  const handleConfirmIngredients = () => {
    if (selectedIngredients.length > 0) {
      onIngredientsIdentified(selectedIngredients);
      
      // Reset the component
      setImageSource(null);
      setAnalysisResults(null);
      setSelectedIngredients([]);
      
      // Close modal
      onClose();
    }
  };
  
  // Cancel and close
  const handleCancel = () => {
    // Reset state
    setImageSource(null);
    setAnalysisResults(null);
    setSelectedIngredients([]);
    stopCamera();
    
    // Close modal
    onClose();
  };
  
  // Reset everything
  const handleReset = () => {
    setImageSource(null);
    setCameraActive(false);
    setAnalysisResults(null);
    setSelectedIngredients([]);
  };
  
  return (
    <CaptureContainer elevation="medium" padding="large" borderRadius="medium">
      <CaptureHeader>
        <Title>{t('inventory.scanIngredients')}</Title>
        <Description>{t('inventory.scanDescription')}</Description>
      </CaptureHeader>
      
      <CapturePreview>
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {cameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
          />
        ) : imageSource ? (
          <>
            <img 
              ref={imgRef}
              src={imageSource} 
              alt={t('inventory.capturedImage')} 
            />
            
            {/* Detection overlay with bounding boxes */}
            {analysisResults && (
              <DetectionOverlay>
                {analysisResults.detections.map((item, index) => (
                  item.boundingBox && (
                    <BoundingBox 
                      key={`box-${index}`}
                      box={item.boundingBox}
                      data-label={`${item.class} (${Math.round(item.confidence * 100)}%)`}
                    />
                  )
                ))}
              </DetectionOverlay>
            )}
          </>
        ) : (
          <PreviewPlaceholder>
            <div>📸</div>
            <p>{t('inventory.noImageSelected')}</p>
          </PreviewPlaceholder>
        )}
      </CapturePreview>
      
      <CaptureControls>
        <FileInput 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        {!cameraActive && !imageSource && (
          <>
            <Button 
              variant="primary" 
              onClick={startCamera}
              disabled={cameraStarting}
              rightIcon="📷"
            >
              {t('inventory.openCamera')}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleOpenFileSelector}
              rightIcon="📁"
            >
              {t('inventory.selectImage')}
            </Button>
          </>
        )}
        
        {cameraActive && (
          <>
            <Button 
              variant="primary" 
              onClick={handleCaptureImage}
              disabled={isCapturing}
              rightIcon="📸"
            >
              {isCapturing ? t('inventory.capturing') : t('inventory.capturePhoto')}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              {t('inventory.cancelCapture')}
            </Button>
          </>
        )}
        
        {imageSource && !analysisResults && (
          <>
            <Button 
              variant="primary" 
              onClick={analyzeImage}
              disabled={isAnalyzing}
              rightIcon="🔍"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="small" />
                  {t('inventory.analyzing')}
                </>
              ) : (
                t('inventory.analyzeImage')
              )}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              {t('common.cancel')}
            </Button>
          </>
        )}
        
        {analysisResults && (
          <>
            <Button 
              variant="primary" 
              onClick={handleConfirmIngredients}
              disabled={selectedIngredients.length === 0}
            >
              {t('inventory.addToInventory')}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              {t('inventory.startOver')}
            </Button>
          </>
        )}
      </CaptureControls>
      
      {analysisResults && (
        <ResultsContainer>
          <ResultsTitle>
            {t('inventory.detectedIngredients')} ({analysisResults.ingredients.length})
          </ResultsTitle>
          
          {analysisResults.ingredients.length > 0 ? (
            <IngredientList>
              {analysisResults.ingredients.map((item, index) => {
                const isSelected = selectedIngredients.some(i => 
                  i.name === item.name
                );
                
                return (
                  <IngredientItem key={`ingredient-${index}`}>
                    <IngredientInfo>
                      <IngredientName>{item.name}</IngredientName>
                      <IngredientConfidence>
                        {Math.round(item.confidence * 100)}% {t('inventory.confidence')}
                      </IngredientConfidence>
                    </IngredientInfo>
                    
                    <IngredientActions>
                      <Button 
                        variant={isSelected ? "primary" : "secondary"} 
                        size="small"
                        onClick={() => toggleIngredientSelection(item)}
                      >
                        {isSelected ? t('inventory.selected') : t('inventory.select')}
                      </Button>
                    </IngredientActions>
                  </IngredientItem>
                );
              })}
            </IngredientList>
          ) : (
            <p>{t('inventory.noIngredientsDetected')}</p>
          )}
        </ResultsContainer>
      )}
    </CaptureContainer>
  );
};

export default ImageCapture;
