import { SelectedState } from './selected.reducer'
import { TypeModel } from '@shared/data-access/models'

export function addToMultiSelectArray(newItem: string, multiSelectIds?: string[]): string[] {
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

export function addToMap(
  panelId: string,
  x: number,
  y: number,
  map?: Map<string, { x: number; y: number }>,
): Map<string, { x: number; y: number }> {
  if (map) {
    if (map.size > 0) {
      return map.set(panelId, { x, y })
    } else {
      return map.set(panelId, { x, y })
    }
  } else {
    const newMap = new Map<string, { x: number; y: number }>()
    return newMap.set(panelId, { x, y })
  }
}

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
