export interface Point {
  x: number;
  y: number;
}

export interface Calculation {
  id: string;
  fileName: string;
  imageWidth: number;
  imageHeight: number;
  totalPoints: number;
  pointsInStain: number;
  estimatedArea: number;
  areaPercentage: number;
  timestamp: Date;
  imageDataUrl: string;
}

export interface CalculationState {
  image: HTMLImageElement | null;
  imageData: ImageData | null;
  fileName: string;
  totalPoints: number;
  generatedPoints: Point[];
  pointsInStain: Point[];
  calculation: Calculation | null;
  isProcessing: boolean;
}