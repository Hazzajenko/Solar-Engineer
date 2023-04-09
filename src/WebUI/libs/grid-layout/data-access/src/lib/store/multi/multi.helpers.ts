import { SelectedState } from '../selected/grid-selected.reducer'
import { TypeModel } from '@shared/data-access/models'

export function addPanelToMultiselect(panelId: string, state: SelectedState) {
  if (!state.multiSelect) {
    if (state.type === TypeModel.PANEL) {
      if (state.singleSelectId) {
        return {
          multiSelectUnit: TypeModel.PANEL,
          multiSelect: true,
          multiSelectIds: [state.singleSelectId, panelId],
        }
      }
    }
  }
  if (state.multiSelectIds) {
    if (state.multiSelectIds.length > 0) {
      return {
        multiSelectUnit: TypeModel.PANEL,
        multiSelect: true,
        multiSelectIds: [...state.multiSelectIds, panelId],
      }
    } else {
      return {
        multiSelectUnit: TypeModel.PANEL,
        multiSelect: true,
        multiSelectIds: [panelId],
      }
    }
  } else {
    return {
      multiSelectUnit: TypeModel.PANEL,
      multiSelect: true,
      multiSelectIds: [panelId],
    }
  }
}