import { Component, input, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  CalculationState } from '../models/calculation.model';
import { PhotoIconComponent } from './icons/photo.icon';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, PhotoIconComponent],
  template: `
    <div>
      @if (state().image) {
        @if (state().calculation) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-96">
            <!-- Columna de la imagen -->
            <div class="canvas-container border border-gray-200 rounded-lg overflow-hidden relative w-full h-full">
              <canvas
                #imageCanvas
                class="w-full h-full object-contain"
              ></canvas>
              <canvas
                #pointsCanvas
                class="canvas-overlay w-full h-full absolute top-0 left-0 pointer-events-none object-contain"
              ></canvas>
            </div>
            
            <!-- Columna de resultados -->
            <div class="flex flex-col h-full">
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg animate-bounce-in h-full flex flex-col justify-center">
                <h4 class="font-semibold text-green-800 mb-4 text-center">Resultados del Cálculo</h4>
                <div class="space-y-4">
                  <div class="text-center p-3 bg-white rounded border">
                    <div class="text-green-600 text-sm font-medium">Puntos en la mancha</div>
                    <div class="text-2xl font-bold text-green-800 mt-1">{{ state().calculation?.pointsInStain }}/{{ state().calculation?.totalPoints }}</div>
                  </div>
                  <div class="text-center p-3 bg-white rounded border">
                    <div class="text-green-600 text-sm font-medium">Área estimada</div>
                    <div class="text-2xl font-bold text-green-800 mt-1">{{ state().calculation?.estimatedArea }} px²</div>
                  </div>
                  <div class="text-center p-3 bg-white rounded border">
                    <div class="text-green-600 text-sm font-medium">Porcentaje de área</div>
                    <div class="text-2xl font-bold text-green-800 mt-1">{{ state().calculation?.areaPercentage }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Solo imagen cuando no hay cálculo -->
          <div class="canvas-container border border-gray-200 rounded-lg overflow-hidden relative w-full max-w-2xl mx-auto">
            <canvas
              #imageCanvas
              class="w-full h-auto block max-h-96 object-contain"
            ></canvas>
            <canvas
              #pointsCanvas
              class="canvas-overlay w-full h-auto absolute top-0 left-0 pointer-events-none max-h-96 object-contain"
            ></canvas>
          </div>
        }
      } @else {
        <div class="text-center py-12 text-gray-500">
          <div class="flex justify-center mb-4">
            <icon-photo classes="w-16 h-16 text-gray-400" />
          </div>
          <p>Carga una imagen para ver la vista previa</p>
        </div>
      }
    </div>
  `
})
export class ImageViewerComponent implements AfterViewInit {
  state = input.required<CalculationState>();
  
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pointsCanvas', { static: false }) pointsCanvas!: ElementRef<HTMLCanvasElement>;

  private viewInitialized = false;
  private lastImageSrc: string | null = null;

  constructor() {
    effect(() => {
      const currentState = this.state();
      if (currentState.image) {
        this.renderImageAndPoints();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // Intentar renderizar si ya hay una imagen disponible
    if (this.state().image) {
      this.renderImageAndPoints();
    }
  }

  private renderImageAndPoints(): void {
    if (!this.viewInitialized) {
      return;
    }

    // Asegurar que la imagen esté completamente cargada antes de dibujar
    const currentState = this.state();
    if (!currentState.image) {
      return;
    }

    // Esperar a que el canvas esté disponible
    this.waitForCanvas().then(() => {
      const currentImageSrc = currentState.image!.src;
      // Redibujar la imagen solo si es nueva
      if (this.lastImageSrc !== currentImageSrc) {
        this.lastImageSrc = currentImageSrc;
        this.drawImage();
      }
      // Siempre redibujar los puntos porque pueden haber cambiado
      this.drawPoints();
    });
  }

  private waitForCanvas(): Promise<void> {
    return new Promise((resolve) => {
      const checkCanvas = () => {
        if (this.imageCanvas?.nativeElement) {
          resolve();
        } else {
          // Usar requestAnimationFrame para esperar el siguiente frame
          requestAnimationFrame(checkCanvas);
        }
      };
      checkCanvas();
    });
  }

  private drawImage(): void {
    const canvas = this.imageCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const image = this.state().image;
    
    if (!ctx || !image) return;

    // Obtener el tamaño del contenedor
    const container = canvas.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Configurar tamaño del canvas para llenar el contenedor
    const scale = Math.min(containerWidth / image.width, containerHeight / image.height);
    
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    
    // Configurar canvas de puntos con el mismo tamaño
    if (this.pointsCanvas?.nativeElement) {
      this.pointsCanvas.nativeElement.width = canvas.width;
      this.pointsCanvas.nativeElement.height = canvas.height;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  private drawPoints(): void {
    if (!this.pointsCanvas) return;
    
    const canvas = this.pointsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const currentState = this.state();
    
    if (!ctx || !currentState.image) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState.generatedPoints.length === 0) return;

    const scaleX = canvas.width / currentState.image.width;
    const scaleY = canvas.height / currentState.image.height;

    // Configurar tamaño de puntos responsive
    const isMobile = window.innerWidth < 640;
    const pointSizeOut = isMobile ? 1.5 : 2;
    const pointSizeIn = isMobile ? 2.5 : 3;

    // Dibujar todos los puntos generados
    ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'; // Puntos rojos para los que están fuera
    currentState.generatedPoints.forEach(point => {
      const isInStain = currentState.pointsInStain.some(p => p.x === point.x && p.y === point.y);
      if (!isInStain) {
        ctx.beginPath();
        ctx.arc(point.x * scaleX, point.y * scaleY, pointSizeOut, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Dibujar puntos que están en la mancha
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'; // Puntos verdes para los que están en la mancha
    currentState.pointsInStain.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x * scaleX, point.y * scaleY, pointSizeIn, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}