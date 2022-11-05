export interface StringModel {
  id: number;
  projectId?: number;
  inverterId?: number;
  trackerId?: number;
  name: string;
  isInParallel: boolean;
  panelAmount?: number;
  createdAt?: string;
}
