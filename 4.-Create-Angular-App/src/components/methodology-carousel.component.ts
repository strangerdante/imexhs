import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

interface MethodologyStep {
  title: string;
  description: string;
  details: string[];
}

@Component({
  selector: 'app-methodology-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="card animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">Metodología Monte Carlo</h2>
      </div>

      <swiper-container 
        #swiper
        auto-height="true"
      >
        @for (step of steps; track $index) {
          <swiper-slide>
            <div class="text-center p-2 flex flex-col">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ step.title }}</h3>
              <p class="text-gray-600 mb-6 text-lg">{{ step.description }}</p>
              
              <div class="bg-gray-50 rounded-lg p-4 text-left">
                <ul class="space-y-2">
                  @for (detail of step.details; track detail) {
                    <li class="flex items-start space-x-2">
                      <span class="text-primary-500 mt-1">•</span>
                      <span class="text-gray-700">{{ detail }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </swiper-slide>
        }
      </swiper-container>

      <!-- Paginación personalizada -->
      <div class="flex justify-center mt-4 space-x-3">
        @for (step of steps; track $index; let i = $index) {
          <button 
            (click)="goToSlide(i)"
            [class]="getPaginationButtonClass(i)"
            class="w-7 h-7 rounded-full font-bold text-sm transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {{ i + 1 }}
          </button>
        }
      </div>
    </div>
  `,
  styles: []
})
export class MethodologyCarouselComponent {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  currentSlide = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.swiperRef?.nativeElement) {
      const swiper = this.swiperRef.nativeElement.swiper;
      swiper.on('slideChange', () => {
        this.currentSlide = swiper.activeIndex;
        // Forzar la detección de cambios para actualizar la paginación
        this.cdr.detectChanges();
      });
    }
  }

  goToSlide(index: number) {
    if (this.swiperRef?.nativeElement) {
      this.swiperRef.nativeElement.swiper.slideTo(index);
    }
  }

  getPaginationButtonClass(index: number): string {
    return this.currentSlide === index 
      ? 'bg-primary-500 text-white shadow-lg' 
      : 'bg-primary-100 text-primary-600 hover:bg-primary-200';
  }
  
  steps: MethodologyStep[] = [
    {
      title: 'Cargar Imagen Binaria',
      description: 'Sube una imagen donde los píxeles blancos representan la mancha y los negros el fondo.',
      details: [
        'La imagen debe ser binaria (blanco y negro)',
        'Píxeles blancos = mancha a medir',
        'Píxeles negros = fondo',
        'Formatos soportados: PNG, JPG, BMP'
      ]
    },
    {
      title: 'Generar Puntos Aleatorios',
      description: 'Se generan n puntos aleatorios distribuidos uniformemente sobre la imagen.',
      details: [
        'Los puntos se distribuyen aleatoriamente',
        'Cada punto tiene coordenadas (x, y)',
        'Mayor cantidad de puntos = mayor precisión',
        'Rango recomendado: 500-5000 puntos'
      ]
    },
    {
      title: 'Calcular Área de la Mancha',
      description: 'Se cuenta cuántos puntos caen en la región blanca y se calcula el área usando Monte Carlo.',
      details: [
        'Se evalúa el color del píxel en cada punto generado',
        'Se cuenta el número ni de puntos en la mancha (píxeles blancos)',
        'Área = (Área Total) × (ni/n)',
        'Área Total = ancho × alto de la imagen',
        'Resultado final en píxeles cuadrados'
      ]
    }
  ];
}