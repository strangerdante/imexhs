import { Injectable, signal } from '@angular/core';
import { Calculation } from '../models/calculation.model';

@Injectable({
  providedIn: 'root'
})
export class CalculationHistoryService {
  private readonly STORAGE_KEY = 'stain-calculations';
  private readonly calculations = signal<Calculation[]>([]);

  public readonly allCalculations = this.calculations.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  addCalculation(calculation: Calculation): void {
    this.calculations.update(current => [calculation, ...current]);
    this.saveToStorage();
  }

  removeCalculation(id: string): void {
    this.calculations.update(current => 
      current.filter(calc => calc.id !== id)
    );
    this.saveToStorage();
  }

  clearAll(): void {
    this.calculations.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Convertir las fechas de string a Date
        const calculations = data.map((calc: any) => ({
          ...calc,
          timestamp: new Date(calc.timestamp)
        }));
        this.calculations.set(calculations);
      }
    } catch (error) {
      console.error('Error loading calculations from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.calculations()));
    } catch (error) {
      console.error('Error saving calculations to storage:', error);
    }
  }
}