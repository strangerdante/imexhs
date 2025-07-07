import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-check',
  standalone: true,
  template: `
    <svg [class]="classes()" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  `
})
export class CheckIconComponent {
  classes = input<string>('w-6 h-6');
} 