import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-points-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="process-card">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">2. Configurar Puntos Aleatorios</h3>
      
      <div class="space-y-4">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Pocos puntos (rápido)</span>
          <span>Muchos puntos (preciso)</span>
        </div>
        
        <div class="relative">
          <input
            type="range"
            [min]="minPoints"
            [max]="maxPoints"
            [step]="step"
            [value]="currentPoints()"
            (input)="onPointsChange($event)"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          >
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ minPoints }} puntos</span>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ currentPoints() }}</div>
            <div class="text-sm text-gray-500">puntos seleccionados</div>
          </div>
          <span class="text-sm text-gray-500">{{ maxPoints }} puntos</span>
        </div>
        

      </div>
    </div>
  `,
  styles: [`
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `]
})
export class PointsSliderComponent {
  currentPoints = input.required<number>();
  pointsChanged = output<number>();
  
  minPoints = 100;
  maxPoints = 5000;
  step = 100;

  onPointsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.pointsChanged.emit(value);
  }
}