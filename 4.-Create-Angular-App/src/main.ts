import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CalculationTabComponent } from './components/calculation-tab.component';
import { HistoryTabComponent } from './components/history-tab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalculationTabComponent, HistoryTabComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Tabs como Header -->
      <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div class="flex space-x-0 sm:space-x-1 pb-0 overflow-x-auto mobile-tabs">
            @for (tab of tabs; track tab.id; let isFirst = $first; let isLast = $last) {
              <button
                (click)="setActiveTab(tab.id)"
                [class]="activeTab() === tab.id ? 
                  'border-primary-500 text-primary-700 bg-primary-50/50 shadow-primary-500/20' : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
                class="relative py-4 sm:py-5 px-4 sm:px-8 border-b-4 font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out group flex-1 sm:flex-none whitespace-nowrap min-w-0"
                [class.ml-1]="!isFirst"
              >
                <!-- Gradiente de fondo activo -->
                @if (activeTab() === tab.id) {
                  <div class="absolute inset-0 bg-gradient-to-b from-primary-50 to-transparent opacity-60"></div>
                }
                
                <!-- Línea de resaltado mejorada -->
                @if (activeTab() === tab.id) {
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-t-md shadow-lg shadow-primary-500/30 animate-slide-in"></div>
                }
                
                <!-- Contenido del tab -->
                <div class="relative flex items-center justify-center sm:justify-start z-10 min-w-0">
                  <span class="font-medium truncate">{{ tab.label }}</span>
                </div>
                
                <!-- Efecto hover sutil -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pt-20 sm:pt-24">
        @switch (activeTab()) {
          @case ('calculation') {
            <app-calculation-tab />
          }
          @case ('history') {
            <app-history-tab />
          }
        }
      </main>

    </div>
  `
})
export class App {
  activeTab = signal<'calculation' | 'history'>('calculation');
  
  tabs = [
    { id: 'calculation' as const, label: 'Calcular Área' },
    { id: 'history' as const, label: 'Historial' }
  ];

  setActiveTab(tab: 'calculation' | 'history'): void {
    this.activeTab.set(tab);
  }
}

bootstrapApplication(App).catch(err => console.error(err));