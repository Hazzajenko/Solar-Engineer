export interface PanelConfigDto {
  type: string;
  brand: string | null;
  name: string;
  fullName: string;
  currentAtMaximumPower: number;
  shortCircuitCurrent: number;
  shortCircuitCurrentTemp: number;
  length: number;
  maximumPower: number;
  maximumPowerTemp: number;
  voltageAtMaximumPower: number;
  openCircuitVoltage: number;
  openCircuitVoltageTemp: number;
  weight: number;
  width: number;
  default: boolean;
  id: string;
  createdTime: string;
  lastModifiedTime: string;
  createdById: string | null;
}