import { Update } from '@ngrx/entity'
import { PanelModel } from '@shared/data-access/models'

export function toUpdatePanelArray(selectedPanelIds: string[], stringId: string) {
  return selectedPanelIds.map((panelId) => {
    const update: Update<PanelModel> = {
      id: panelId,
      changes: {
        stringId,
      },
    }
    return update
  })
}
