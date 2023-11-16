export interface FeeButton {
  text: string;
  type: UnitsOfMeasurement;
}

export enum UnitsOfMeasurement {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}
