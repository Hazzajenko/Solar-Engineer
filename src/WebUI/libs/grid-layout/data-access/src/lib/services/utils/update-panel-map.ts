import { Update } from '@ngrx/entity'
import { PanelModel } from '@shared/data-access/models'

export function toUpdatePanelArray(selectedPanelIds: string[], changes: Partial<PanelModel>) {
  return selectedPanelIds.map((panelId) => {
    const update: Update<PanelModel> = {
      id: panelId,
      changes
    }
    return update
  })
}


