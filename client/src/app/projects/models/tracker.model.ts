import { UnitModel } from './unit.model';

export interface TrackerModel {
  id: number;
  projectId: number;
  inverterId: number;
  model?: UnitModel;
  name: string;
  maxInputCurrent?: number;
  maxShortCircuitCurrent?: number;
  stringAmount?: number;
  parallelAmount?: number;
  panelAmount?: number;
  // parallelLinks?: ParallelModel[];
  createdAt?: string;
  createdBy: number;
  version: number;
}
