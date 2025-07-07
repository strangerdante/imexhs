import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageProcessingService } from '../services/image-processing.service';
import { CalculationHistoryService } from '../services/calculation-history.service';
import { MethodologyCarouselComponent } from './methodology-carousel.component';
import { ImageUploaderComponent } from './image-uploader.component';
import { PointsSliderComponent } from './points-slider.component';
import { ImageViewerComponent } from './image-viewer.component';
import { ArrowPathIconComponent } from './icons/arrow-path.icon';
import { FolderIconComponent } from './icons/folder.icon';
import { CogIconComponent } from './icons/cog.icon';
import { ChartBarIconComponent } from './icons/chart-bar.icon';
import { ClipboardIconComponent } from './icons/clipboard.icon';

@Component({
  selector: 'app-calculation-tab',
  standalone: true,
  imports: [
    CommonModule,
    MethodologyCarouselComponent,
    ImageUploaderComponent,
    PointsSliderComponent,
    ImageViewerComponent,
    ArrowPathIconComponent,
    FolderIconComponent,
    CogIconComponent,
    ChartBarIconComponent,
    ClipboardIconComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Metodología -->
      <app-methodology-carousel />
      
      <!-- Contenido principal con wizard integrado -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header del wizard mejorado -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 sm:py-5 border-b border-blue-100">
          <div class="flex items-center justify-between gap-2 sm:gap-4">
            <div class="flex items-center flex-1 min-w-0">
              <!-- Indicador de progreso mejorado -->
              @for (step of steps; track step.number; let isLast = $last) {
                <div class="flex items-center">
                  <div class="relative">
                    <!-- Círculo del paso con gradiente -->
                    <div 
                      class="w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm relative z-10"
                      [class]="getEnhancedStepClasses(step.number)"
                    >
                      @if (step.number < currentStep() || currentStep() === 3) {
                        <svg class="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      } @else {
                        <span class="font-bold text-xs sm:text-sm">{{ step.number }}</span>
                      }
                    </div>
                    <!-- Anillo de progreso para el paso actual -->
                    @if (step.number === currentStep() && currentStep() !== 3) {
                      <div class="absolute inset-0 w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 border-blue-300 animate-pulse z-0"></div>
                    }
                  </div>
                  
                  @if (!isLast) {
                    <!-- Línea conectora que toca los círculos -->
                    <div class="flex-1 h-0.5 sm:h-1 bg-gray-200 overflow-hidden" style="min-width: 50px; max-width: 80px;">
                      <div 
                        class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 transform origin-left"
                        [class]="step.number < currentStep() || currentStep() === 3 ? 'scale-x-100' : 'scale-x-0'"
                      ></div>
                    </div>
                  }
                </div>
              }
            </div>
            
            <!-- Badge del paso actual -->
            <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div class="hidden md:flex items-center space-x-2 text-blue-700">
                <div class="text-2xl">
                  @switch (currentStep()) {
                    @case (1) { <icon-folder classes="w-6 h-6 sm:w-8 sm:h-8" /> }
                    @case (2) { <icon-cog classes="w-6 h-6 sm:w-8 sm:h-8" /> }
                    @case (3) { <icon-chart-bar classes="w-6 h-6 sm:w-8 sm:h-8" /> }
                    @default { <icon-clipboard classes="w-6 h-6 sm:w-8 sm:h-8" /> }
                  }
                </div>
                <div>
                  <div class="text-sm font-medium">{{ steps[currentStep() - 1].title }}</div>
                  <div class="text-xs text-blue-500">Paso {{ currentStep() }} de {{ steps.length }}</div>
                </div>
              </div>
              
              <!-- Badge compacto para móvil y tablet -->
              <div class="md:hidden bg-blue-100 text-blue-700 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {{ steps[currentStep() - 1].title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido del paso -->
        @switch (currentStep()) {
          @case (1) {
            <div class="p-6">
              <app-image-uploader (fileSelected)="onFileSelected($event)" />
            </div>
          }
          
          @case (2) {
            <div class="p-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <app-points-slider 
                    [currentPoints]="state().totalPoints"
                    (pointsChanged)="onPointsChanged($event)"
                  />
                  
                  <div class="mt-6 flex space-x-4">
                    <button
                      (click)="goToPreviousStep()"
                      class="flex-1 btn-secondary"
                    >
                      ← Volver
                    </button>
                    <button
                      (click)="calculateAndShowResults()"
                      [disabled]="state().isProcessing"
                      class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      @if (state().isProcessing) {
                        <div class="flex items-center justify-center space-x-2">
                          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Calculando...</span>
                        </div>
                      } @else {
                        Calcular →
                      }
                    </button>
                  </div>
                </div>
                
                <div>
                  <app-image-viewer [state]="state()" />
                </div>
              </div>
            </div>
          }
          
          @case (3) {
            <div class="p-6">
              <app-image-viewer [state]="state()" />
              
              <div class="mt-8 flex justify-center">
                <button
                  (click)="resetWizard()"
                  class="btn-primary flex items-center space-x-2"
                >
                  <icon-arrow-path classes="w-5 h-5" />
                  <span>Analizar Nueva Imagen</span>
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center;
    }
    
    .btn-secondary {
      @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center;
    }
  `]
})
export class CalculationTabComponent {
  currentStep = signal(1);
  
  steps = [
    { number: 1, title: 'Cargar Imagen' },
    { number: 2, title: 'Configurar' },
    { number: 3, title: 'Resultados' }
  ];

  constructor(
    private readonly imageProcessingService: ImageProcessingService,
    private readonly historyService: CalculationHistoryService
  ) {}

  state = this.imageProcessingService.currentState;
  
  getEnhancedStepClasses(stepNumber: number): string {
    const current = this.currentStep();
    
    // Si estamos en el paso de resultados (3), todos los pasos se muestran como completados
    if (current === 3) {
      return 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30';
    }
    
    // Para otros pasos, lógica normal
    if (stepNumber < current) {
      return 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30';
    } else if (stepNumber === current) {
      return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30';
    } else {
      return 'bg-gray-200 text-gray-500 border border-gray-300';
    }
  }

  async onFileSelected(file: File): Promise<void> {
    try {
      await this.imageProcessingService.loadImage(file);
      // Avanzar automáticamente al siguiente paso
      this.currentStep.set(2);
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Error al cargar la imagen. Por favor, intenta con otra imagen.');
    }
  }

  onPointsChanged(points: number): void {
    this.imageProcessingService.setTotalPoints(points);
  }

  async calculateAndShowResults(): Promise<void> {
    try {
      const calculation = await this.imageProcessingService.calculateStainArea();
      this.historyService.addCalculation(calculation);
      // Avanzar automáticamente al paso de resultados
      this.currentStep.set(3);
    } catch (error) {
      console.error('Error calculating area:', error);
      alert('Error al calcular el área. Por favor, intenta nuevamente.');
    }
  }

  goToNextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(step => step + 1);
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  resetWizard(): void {
    this.imageProcessingService.resetState();
    this.currentStep.set(1);
  }
}