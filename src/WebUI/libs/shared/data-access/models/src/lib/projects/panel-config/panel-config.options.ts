import { EntityOptions } from '../entity.model'

export interface PanelConfigOptions extends EntityOptions {
  brand?: string;
  name: string;
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
  createdById: string;
}

