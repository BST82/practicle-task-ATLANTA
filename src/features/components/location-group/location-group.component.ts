// location-group.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../core/models/fleet.models'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-location-group',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule,VehicleCardComponent],
  templateUrl: './location-group.component.html',
  styleUrls: ['./location-group.component.css']
})
export class LocationGroupComponent {
  @Input() location!: string;
  @Input() vehicles!: Vehicle[];
  panelOpenState = true;
}