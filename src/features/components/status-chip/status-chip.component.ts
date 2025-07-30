// status-chip.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip 
      [ngClass]="{
        'running': status === 'Running',
        'idle': status === 'Idle',
        'offline': status === 'Offline'
      }">
      {{ status }}
    </mat-chip>
  `,
  styles: [`
    .running { background-color: #4caf50 !important; color: white; }
    .idle { background-color: #ff9800 !important; color: white; }
    .offline { background-color: #f44336 !important; color: white; }
  `]
})
export class StatusChipComponent {
  @Input() status!: 'Running' | 'Idle' | 'Offline';
}