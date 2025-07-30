export interface Vehicle {
  id: number;
  name: string; // Registration number
  imei: string;
  location: string;
  status: 'Running' | 'Idle' | 'Offline';
  lastSeen: string; // ISO string
}

export interface Driver {
  id: number;
  name: string;
}

export interface Assignment {
   [vehicleId: number]: number | null;
}

export interface GroupedAssignment {
  [location: string]: { vehicle: string; driver: string | null }[];
}