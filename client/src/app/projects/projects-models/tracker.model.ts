export interface TrackerModel {
  id: number;
  projectId: number;
  inverterId: number;
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
