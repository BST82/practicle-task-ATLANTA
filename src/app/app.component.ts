import { Component, inject } from '@angular/core';
import { FleetService } from './services/fleet.service';
import { GroupedAssignment } from '../core/models/fleet.models';
import { LocationGroupComponent } from '../features/components/location-group/location-group.component'; 
import { AsyncPipe, KeyValuePipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    KeyValuePipe // Add KeyValuePipe here
    ,
    LocationGroupComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private fleetService = inject(FleetService);
  groupedVehicles$ = this.fleetService.getGroupedVehicles();
  assignments$ = this.fleetService.getAssignments();

  // Helper function to get object keys
  getObjectKeys(obj: any): any {
    return obj;
  }

  saveAssignments() {
    this.assignments$.subscribe(assignments => {
      const grouped: GroupedAssignment = {};
      
      this.fleetService.getVehicles().forEach(vehicle => {
        const driverId = assignments[vehicle.id];
        const driver = driverId 
          ? this.fleetService.getDrivers().find(d => d.id === driverId)?.name || null
          : null;
        
        grouped[vehicle.location] = grouped[vehicle.location] || [];
        grouped[vehicle.location].push({
          vehicle: vehicle.name,
          driver: driver
        });
      });

      console.log('Saved assignments:', grouped);
      alert('Assignments saved successfully! Check console for output.');
    });
  }
}