export interface PanelModel {
  id?: number;
  projectId?: number;
  inverterId?: number;
  trackerId?: number;
  brand?: string;
  model?: string;
  name?: string;
  currentAtMaximumPower?: number;
  shortCircuitCurrent?: number;
  shortCircuitCurrentTemp?: number;
  maximumPower?: number;
  maximumPowerTemp?: number;
  voltageAtMaximumPower?: number;
  openCircuitVoltage: number;
  openCircuitVoltageTemp?: number;
  length?: number;
  weight?: number;
  width?: number;
  createdAt?: string;
}
