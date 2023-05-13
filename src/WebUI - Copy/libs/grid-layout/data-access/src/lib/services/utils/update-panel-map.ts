import { Update } from '@ngrx/entity'
import { GridPanelModel } from '@shared/data-access/models'

export function toUpdatePanelArray(selectedPanelIds: string[], changes: Partial<GridPanelModel>) {
  return selectedPanelIds.map((panelId) => {
    const update: Update<GridPanelModel> = {
      id: panelId,
      changes,
    }
    return update
  })
}