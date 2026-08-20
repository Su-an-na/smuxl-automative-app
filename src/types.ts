export type TabType = 'home' | 'passport' | 'shop' | 'diagnostics';

export type DeviceMode = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export interface Vehicle {
  id: string;
  name: string;
  year: number;
  model: string;
  trim: string;
  category: string;
  vin: string;
  image: string;
  heroImage: string;
  hp: number;
  drivetrain: string;
  mileage: string;
  odoNumber: number;
  rangeMiles: number;
  rangeMax: number;
  batteryVoltage: string;
  sysStatus: 'SYS OK' | 'WARNING' | 'CRITICAL';
  healthScore: number;
  healthStatus: 'OPTIMAL' | 'FAIR' | 'CRITICAL';
  ownersCount: number;
  currentOwnerAcquired: string;
  previousOwnerPeriod: string;
  previousOwnerType: string;
}

export interface DiagnosticAlert {
  id: string;
  code: string;
  title: string;
  description: string;
  timeAgo: string;
  severity: 'critical' | 'warning' | 'info';
  module: string;
  recommendedFix?: string;
  affectedPart?: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  mileage: string;
  title: string;
  description: string;
  garageName: string;
  isLatest?: boolean;
  type: 'routine' | 'repair' | 'inspection';
}

export interface ShopPart {
  id: string;
  name: string;
  oemCode: string;
  price: number;
  category: 'Engine' | 'Braking' | 'Suspension' | 'Fluids' | 'Exhaust' | 'Electrical';
  image: string;
  lowStock?: boolean;
  stockCount?: number;
  description: string;
  compatibleModels: string[];
  featured?: boolean;
  rating: number;
}

export interface CartItem {
  part: ShopPart;
  quantity: number;
}

export interface TelemetryData {
  rpm: number;
  rpmStatus: 'IDLE' | 'CRUISING' | 'PEAK';
  coolantTemp: number; // °F
  coolantPercent: number;
  intakePressure: number; // psi
  intakePercent: number;
  massAirFlow: number; // g/s
  mafStatus: 'NOMINAL' | 'HIGH' | 'LOW';
  o2SensorVoltage: number; // V
  o2Status: 'LEAN' | 'OPTIMAL' | 'RICH';
  throttlePos: number; // %
  boostPressure: number; // psi
  oilPressure: number; // psi
  speedMph: number;
}

export interface HotspotPin {
  id: string;
  title: string;
  system: string;
  status: string;
  statusType: 'optimal' | 'warning' | 'info';
  x: number; // percentage in view
  y: number; // percentage in view
  details: { label: string; value: string }[];
}
