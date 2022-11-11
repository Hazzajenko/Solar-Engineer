import { UnitModel } from './unit.model';

export interface InverterModel {
  id: number;
  projectId: number;
  model?: UnitModel;
  name: string;
  brand: string;
  createdBy: number;
  createdAt: string;
  trackerAmount: number;
  parallelAmount: number;
  stringAmount: number;
  panelAmount: number;
  acNominalOutput: number;
  acOutputCurrent: number;
  europeanEfficiency: number;
  maxInputCurrent: number;
  maxOutputPower: number;
  mppVoltageRangeLow: number;
  mppVoltageRangeHigh: number;
  startUpVoltage: number;
}
