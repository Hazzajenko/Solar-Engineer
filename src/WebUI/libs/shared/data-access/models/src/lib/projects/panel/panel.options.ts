import { BlockOptions } from '../block.model'

export interface PanelOptions extends BlockOptions {
  // id: string;
  stringId: string;
  panelConfigId: string;
  rotation: number
  createdById: string;
}

