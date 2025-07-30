import { Component, Input, inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { FleetService } from '../../../app/services/fleet.service';
import { Vehicle, Driver } from '../../../core/models/fleet.models';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    StatusChipComponent,
    MatIconModule
  ],
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VehicleCardComponent implements OnInit, OnDestroy {
  private fleetService = inject(FleetService);
  private assignmentsSub!: Subscription;

  @Input({ required: true }) vehicle!: Vehicle;
  drivers: Driver[] = [];
  selectedDriver: number | null = null;
  availableDrivers: Driver[] = [];
  assignedDriverName: string | null = null;

  ngOnInit() {
    this.drivers = this.fleetService.getDrivers();
    this.assignmentsSub = this.fleetService.getAssignments().subscribe((assignments) => {
      this.selectedDriver = assignments[this.vehicle.id] || null;
      this.updateAssignedDriverName();
      this.updateAvailableDrivers(assignments);
    });
  }

  ngOnDestroy() {
    this.assignmentsSub?.unsubscribe();
  }

  updateAssignedDriverName() {
    if (this.selectedDriver) {
      const driver = this.drivers.find(d => d.id === this.selectedDriver);
      this.assignedDriverName = driver ? driver.name : null;
    } else {
      this.assignedDriverName = null;
    }
  }

  updateAvailableDrivers(assignments: { [key: string]: number | null }) {
    const assignedDriverIds = new Set<number>();
    Object.entries(assignments).forEach(([vehicleId, driverId]) => {
      if (driverId && parseInt(vehicleId) !== this.vehicle.id) {
        assignedDriverIds.add(driverId);
      }
    });

    this.availableDrivers = this.drivers.filter(
      (driver) => !assignedDriverIds.has(driver.id) || driver.id === this.selectedDriver
    );
  }

  onDriverChange() {
    this.updateAssignedDriverName();
    if (this.vehicle?.id) {
      this.fleetService.updateAssignment(this.vehicle.id, this.selectedDriver);
    }
  }

  getLastSeenMinutes(): string {
    const lastSeen = new Date(this.vehicle.lastSeen).getTime();
    const now = new Date().getTime();
    const minutes = Math.floor((now - lastSeen) / 60000);
    return `${minutes} minutes ago`;
  }
}