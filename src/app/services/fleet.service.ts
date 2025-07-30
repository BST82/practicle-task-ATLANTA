import { BehaviorSubject, map, Observable } from 'rxjs';
import { Vehicle, Driver, Assignment } from '../../core/models/fleet.models';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FleetService {
  private readonly vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'DL01AB1234',
      imei: '356789123456789',
      location: 'Delhi',
      status: 'Running',
      lastSeen: '2025-07-30T10:20:00Z'
    },
    {
      id: 2,
      name: 'DL02XY9876',
      imei: '352345678901234',
      location: 'Delhi',
      status: 'Offline',
      lastSeen: '2025-07-30T09:50:00Z'
    },
    {
      id: 3,
      name: 'MH12CD5678',
      imei: '359876543210987',
      location: 'Mumbai',
      status: 'Idle',
      lastSeen: '2025-07-30T10:10:00Z'
    },
    {
      id: 4,
      name: 'KA03EF9012',
      imei: '351234567890123',
      location: 'Bengaluru',
      status: 'Running',
      lastSeen: '2025-07-30T10:15:00Z'
    },
    {
      id: 5,
      name: 'TN04GH3456',
      imei: '358765432109876',
      location: 'Chennai',
      status: 'Idle',
      lastSeen: '2025-07-30T08:30:00Z'
    },
    {
      id: 6,
      name: 'GJ05IJ7890',
      imei: '357890123456789',
      location: 'Ahmedabad',
      status: 'Idle',
      lastSeen: '2025-07-30T10:25:00Z'
    },
    {
      id: 7,
      name: 'DL03KL2345',
      imei: '354321098765432',
      location: 'Delhi',
      status: 'Running',
      lastSeen: '2025-07-30T10:05:00Z'
    },
    {
      id: 8,
      name: 'MH13MN6789',
      imei: '353210987654321',
      location: 'Mumbai',
      status: 'Offline',
      lastSeen: '2025-07-30T09:45:00Z'
    }
  ];

  private readonly drivers: Driver[] = [
    { id: 1, name: 'Rajesh Kumar' },
    { id: 2, name: 'Fatima Bano' },
    { id: 3, name: 'Amit Singh' },
    { id: 4, name: 'Lalu Yadav' },
    { id: 5, name: 'Kalu Sharma' },
    { id: 6, name: 'Priya Patel' },
    { id: 7, name: 'Sanjay Rao' },
    { id: 8, name: 'Meena Gupta' },
    { id: 9, name: 'Vikram Desai' },
    { id: 10, name: 'Anita Nair' }
  ];

  private assignmentsSubject: BehaviorSubject<{ [key: string]: number | null }>;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Initialize assignments with safe localStorage access
    const initialAssignments = this.isBrowser 
      ? JSON.parse(localStorage.getItem('assignments') || '{}')
      : {
          '1': 1, // Rajesh Kumar assigned to DL01AB1234 (Delhi)
          '3': 3, // Amit Singh assigned to MH12CD5678 (Mumbai)
          '4': 6, // Priya Patel assigned to KA03EF9012 (Bengaluru)
          '6': 9, // Vikram Desai assigned to GJ05IJ7890 (Ahmedabad)
          '7': 2  // Fatima Bano assigned to DL03KL2345 (Delhi)
        };
    
    this.assignmentsSubject = new BehaviorSubject<{ [key: string]: number | null }>(initialAssignments);
  }
  
  getVehicles() {
    return this.vehicles;
  }

  getDrivers() {
    console.log('FleetService.getDrivers:', this.drivers); 
    return this.drivers;
  }

  getAssignments() {
    return this.assignmentsSubject.asObservable();
  }

  updateAssignment(vehicleId: number, driverId: number | null) {
    const current = this.assignmentsSubject.value;
    const newAssignments: { [key: string]: number | null } = { ...current, [vehicleId]: driverId };
    
    // Prevent duplicate driver assignment
    if (driverId) {
      Object.keys(newAssignments).forEach(key => {
        if (newAssignments[key] === driverId && parseInt(key) !== vehicleId) {
          newAssignments[key] = null;
        }
      });
    }

    // Only update localStorage in browser environment
    if (this.isBrowser) {
      localStorage.setItem('assignments', JSON.stringify(newAssignments));
    }
    this.assignmentsSubject.next(newAssignments);
  }

  getGroupedVehicles(): Observable<Record<string, Vehicle[]>> {
    return this.getAssignments().pipe(
      map(assignments => {
        const grouped: { [location: string]: Vehicle[] } = {};
        this.vehicles.forEach(vehicle => {
          grouped[vehicle.location] = grouped[vehicle.location] || [];
          grouped[vehicle.location].push(vehicle);
        });
        return grouped;
      })
    );
  }
}