import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraIconComponent } from './icons/camera.icon';
import { CheckIconComponent } from './icons/check.icon';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, CameraIconComponent, CheckIconComponent],
  template: `
    <div>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-200">
        <input
          #fileInput
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          class="hidden"
        >
        
        <div class="flex justify-center mb-4">
          <icon-camera classes="w-16 h-16 text-gray-400" />
        </div>
        <p class="text-gray-600 mb-4">Arrastra una imagen aquí o haz clic para seleccionar</p>
        
        <button
          (click)="fileInput.click()"
          class="btn-primary"
        >
          Subir Imagen
        </button>
      </div>
      
      @if (selectedFileName) {
        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-slide-in">
          <div class="flex items-center space-x-2">
            <icon-check classes="w-5 h-5 text-green-600" />
            <span class="text-green-800 font-medium">{{ selectedFileName }}</span>
          </div>
        </div>
      }
    </div>
  `
})
export class ImageUploaderComponent {
  selectedFileName = '';
  fileSelected = output<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.fileSelected.emit(file);
    }
  }
}