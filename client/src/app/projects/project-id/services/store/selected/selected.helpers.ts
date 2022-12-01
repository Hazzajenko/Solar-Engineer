import { SelectedState } from './selected.reducer'
import { UnitModel } from '../../../../models/unit.model'

export function addToMultiSelectArray(
  newItem: string,
  multiSelectIds?: string[],
): string[] {
  if (multiSelectIds) {
    if (multiSelectIds.length > 0) {
      return [...multiSelectIds, newItem]
    } else {
      return [newItem]
    }
  } else {
    return [newItem]
  }
}

export function addPanelToMultiselect(panelId: string, state: SelectedState) {
  if (!state.multiSelect) {
    if (state.unit === UnitModel.PANEL) {
      if (state.singleSelectId) {
        return {
          multiSelectUnit: UnitModel.PANEL,
          multiSelect: true,
          multiSelectIds: [state.singleSelectId, panelId],
        }
      }
    }
  }
  if (state.multiSelectIds) {
    if (state.multiSelectIds.length > 0) {
      return {
        multiSelectUnit: UnitModel.PANEL,
        multiSelect: true,
        multiSelectIds: [...state.multiSelectIds, panelId],
      }
    } else {
      return {
        multiSelectUnit: UnitModel.PANEL,
        multiSelect: true,
        multiSelectIds: [panelId],
      }
    }
  } else {
    return {
      multiSelectUnit: UnitModel.PANEL,
      multiSelect: true,
      multiSelectIds: [panelId],
    }
  }
}
