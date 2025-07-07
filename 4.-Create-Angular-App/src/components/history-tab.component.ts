import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculationHistoryService } from '../services/calculation-history.service';


@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Historial de Cálculos</h2>
        @if (calculations().length > 0) {
          <button
            (click)="clearHistory()"
            class="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base self-start sm:self-auto"
          >
            Limpiar Historial
          </button>
        }
      </div>

      @if (calculations().length === 0) {
        <div class="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No hay historial</h3>
          <p class="text-sm sm:text-base text-gray-500">Los resultados aparecerán aquí</p>
        </div>
      } @else {
        
        <!-- Vista móvil: Tarjetas apiladas -->
        <div class="block sm:hidden space-y-4">
          @for (calculation of calculations(); track calculation.id) {
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-200">
              <!-- Header de la tarjeta con imagen y archivo -->
              <div class="flex items-center space-x-3 mb-4">
                <div class="flex-shrink-0">
                  <img 
                    [src]="calculation.imageDataUrl" 
                    [alt]="calculation.fileName"
                    [title]="calculation.fileName"
                    class="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-gray-900 text-sm truncate mb-1" [title]="calculation.fileName">
                    {{ calculation.fileName }}
                  </div>
                  <div class="text-xs text-gray-500 font-medium">
                    {{ calculation.imageWidth }} × {{ calculation.imageHeight }} px
                  </div>
                </div>
                <button
                  (click)="removeCalculation(calculation.id)"
                  class="flex-shrink-0 w-10 h-10 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200 flex items-center justify-center"
                  title="Eliminar cálculo"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>

              <!-- Métricas en grid -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Manchas/Puntos -->
                <div class="text-center">
                  <div class="text-xs text-gray-500 font-medium mb-1">Manchas/Puntos</div>
                  <span class="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-bold">
                    {{ calculation.pointsInStain }}/{{ calculation.totalPoints }}
                  </span>
                </div>

                <!-- Área -->
                <div class="text-center">
                  <div class="text-xs text-gray-500 font-medium mb-1">Área</div>
                  <div class="font-bold text-gray-900 text-base">
                    {{ formatNumber(calculation.estimatedArea) }}
                  </div>
                  <div class="text-xs text-gray-500">píxeles²</div>
                </div>
              </div>

              <!-- Porcentaje (ancho completo) -->
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="text-xs text-gray-500 font-medium mb-2 text-center">Porcentaje de área</div>
                <div class="flex flex-col items-center space-y-2">
                  <div class="w-full max-w-40 bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      [style.width.%]="calculation.areaPercentage"
                    ></div>
                  </div>
                  <span class="text-base font-bold text-green-700">{{ calculation.areaPercentage }}%</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Vista desktop: Tabla -->
        <div class="hidden sm:block bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th class="text-left py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">Imagen</th>
                  <th class="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">Manchas/Puntos</th>
                  <th class="text-right py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">Área (px²)</th>
                  <th class="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">Porcentaje</th>
                  <th class="text-center py-4 px-6 font-bold text-gray-800 text-sm uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (calculation of calculations(); track calculation.id) {
                  <tr class="hover:bg-blue-50 transition-all duration-200 group">
                    <td class="py-4 px-6">
                      <div class="flex items-center space-x-4">
                        <div>
                          <img 
                            [src]="calculation.imageDataUrl" 
                            [alt]="calculation.fileName"
                            [title]="calculation.fileName"
                            class="w-14 h-14 object-cover rounded-xl border-[1px] border-gray-200 group-hover:shadow-lg transition-all duration-200"
                          />
                        </div>
                        <div class="min-w-0 flex-1">
                          <div class="font-semibold text-gray-900 text-sm truncate" [title]="calculation.fileName">
                            {{ calculation.fileName }}
                          </div>
                          <div class="text-xs text-gray-500 font-medium">
                            {{ calculation.imageWidth }} × {{ calculation.imageHeight }} px
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <div class="inline-flex items-center">
                        <span class="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-bold shadow-sm">
                          {{ calculation.pointsInStain }}/{{ calculation.totalPoints }}
                        </span>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <div class="font-bold text-gray-900 text-lg">
                        {{ formatNumber(calculation.estimatedArea) }}
                      </div>
                      <div class="text-xs text-gray-500 font-medium">píxeles²</div>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <div class="flex flex-col items-center space-y-2">
                        <div class="flex items-center space-x-2">
                          <div class="w-20 bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div 
                              class="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                              [style.width.%]="calculation.areaPercentage"
                            ></div>
                          </div>
                        </div>
                        <span class="text-sm font-bold text-green-700">{{ calculation.areaPercentage }}%</span>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <button
                        (click)="removeCalculation(calculation.id)"
                        class="inline-flex items-center justify-center w-10 h-10 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-110"
                        title="Eliminar cálculo"
                      >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="py-12 text-center">
                      <div class="flex flex-col items-center space-y-3">
                        <div class="text-4xl text-gray-400">📭</div>
                        <div class="text-gray-500 font-medium">No hay cálculos para mostrar</div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class HistoryTabComponent {
  calculations = this.historyService.allCalculations;

  constructor(private readonly historyService: CalculationHistoryService) {}

  removeCalculation(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cálculo?')) {
      this.historyService.removeCalculation(id);
    }
  }

  clearHistory(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial? Esta acción no se puede deshacer.')) {
      this.historyService.clearAll();
    }
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('es-ES').format(num);
  }
}