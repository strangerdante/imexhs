import { Injectable, signal } from '@angular/core';
import { Point, Calculation, CalculationState } from '../models/calculation.model';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {
  private state = signal<CalculationState>({
    image: null,
    imageData: null,
    fileName: '',
    totalPoints: 1000,
    generatedPoints: [],
    pointsInStain: [],
    calculation: null,
    isProcessing: false
  });

  public readonly currentState = this.state.asReadonly();

  async loadImage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Asegurar que la imagen esté completamente cargada antes de procesar
        if (img.complete && img.naturalHeight !== 0) {
          try {
            // Crear canvas temporal para obtener los datos de la imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('No se pudo crear el contexto del canvas'));
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            
            // Actualizar el estado usando setTimeout para asegurar que se propague correctamente
            setTimeout(() => {
              this.state.update(state => ({
                ...state,
                image: img,
                imageData,
                fileName: file.name,
                generatedPoints: [],
                pointsInStain: [],
                calculation: null
              }));
              // Generar puntos iniciales inmediatamente después de cargar la imagen
              setTimeout(() => {
                this.generateRandomPoints();
              }, 50);
              resolve();
            }, 0);
            
          } catch (error) {
            reject(new Error(`Error al procesar la imagen: ${error}`));
          }
        } else {
          reject(new Error('La imagen no se cargó correctamente'));
        }
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      
      // Crear URL y asignar
      const imageUrl = URL.createObjectURL(file);
      img.src = imageUrl;
      
      // Limpiar URL después de un tiempo para evitar memory leaks
      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    });
  }

  setTotalPoints(points: number): void {
    this.state.update(state => ({
      ...state,
      totalPoints: points
    }));
    
    // Regenerar puntos inmediatamente si hay una imagen cargada
    if (this.state().image) {
      this.generateRandomPoints();
    }
  }

  generateRandomPoints(): Point[] {
    const currentState = this.state();
    if (!currentState.image || !currentState.imageData) return [];

    const points: Point[] = [];
    const { width, height } = currentState.image;

    for (let i = 0; i < currentState.totalPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height
      });
    }

    // Calcular inmediatamente qué puntos están en la mancha para mostrarlos en verde
    const pointsInStain = points.filter(point => 
      this.isPointInStain(point, currentState.imageData!)
    );

    this.state.update(state => ({
      ...state,
      generatedPoints: points,
      pointsInStain: pointsInStain
    }));

    return points;
  }

  private isPointInStain(point: Point, imageData: ImageData): boolean {
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);
    
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
      return false;
    }

    const index = (y * imageData.width + x) * 4;
    const red = imageData.data[index];
    const green = imageData.data[index + 1];
    const blue = imageData.data[index + 2];
    
    // Considerar píxel blanco si la suma RGB es mayor a un umbral
    const brightness = (red + green + blue) / 3;
    return brightness > 127; // Umbral para considerar pixel como blanco
  }

  async calculateStainArea(): Promise<Calculation> {
    const currentState = this.state();
    
    if (!currentState.image || !currentState.imageData) {
      throw new Error('No hay imagen cargada');
    }

    this.state.update(state => ({ ...state, isProcessing: true }));

    // Simular procesamiento asíncrono
    await new Promise(resolve => setTimeout(resolve, 500));

    // Usar los puntos ya generados o generar nuevos si no existen
    const points = currentState.generatedPoints.length > 0 
      ? currentState.generatedPoints 
      : this.generateRandomPoints();
    
    const pointsInStain = points.filter(point => 
      this.isPointInStain(point, currentState.imageData!)
    );

    const totalImageArea = currentState.image.width * currentState.image.height;
    const estimatedArea = totalImageArea * (pointsInStain.length / points.length);
    const areaPercentage = (pointsInStain.length / points.length) * 100;

    // Generar miniatura de la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas para la miniatura');
    }

    // Configurar tamaño de la miniatura (máximo 100x100 manteniendo proporción)
    const maxSize = 100;
    const scale = Math.min(maxSize / currentState.image.width, maxSize / currentState.image.height);
    canvas.width = currentState.image.width * scale;
    canvas.height = currentState.image.height * scale;
    
    ctx.drawImage(currentState.image, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    const calculation: Calculation = {
      id: Date.now().toString(),
      fileName: currentState.fileName,
      imageWidth: currentState.image.width,
      imageHeight: currentState.image.height,
      totalPoints: points.length,
      pointsInStain: pointsInStain.length,
      estimatedArea: Math.round(estimatedArea),
      areaPercentage: Math.round(areaPercentage * 100) / 100,
      timestamp: new Date(),
      imageDataUrl: imageDataUrl
    };

    this.state.update(state => ({
      ...state,
      pointsInStain,
      calculation,
      isProcessing: false
    }));

    return calculation;
  }

  resetState(): void {
    this.state.set({
      image: null,
      imageData: null,
      fileName: '',
      totalPoints: 1000,
      generatedPoints: [],
      pointsInStain: [],
      calculation: null,
      isProcessing: false
    });
  }
}