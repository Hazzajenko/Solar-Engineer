import { Update } from '@ngrx/entity'
import { PanelModel } from '@shared/data-access/models'

export type BlockTaken = {
  action: 'BLOCK_TAKEN'
  data: {
    panelId: string
  }
}

export type UpdatePanel = {
  action: 'UPDATE_PANEL'
  data: {
    update: Update<PanelModel>
  }
}

export type DropActionData = BlockTaken | UpdatePanel
