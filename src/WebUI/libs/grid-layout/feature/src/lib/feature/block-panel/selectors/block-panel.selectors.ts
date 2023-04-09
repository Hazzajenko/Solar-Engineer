import { PANEL_SELECTED } from '../models/panel-selected'
import { STRING_SELECTED } from '../models/string-selected'
import {
  LinksSelectors,
  LinksState,
  PanelsSelectors,
  PathsSelectors,
  SelectedSelectors,
  StringsSelectors,
} from '@grid-layout/data-access'
import { createSelector } from '@ngrx/store'
import {
  BlockPanelModel,
  GridPanelModel,
  GridStringModel,
  PathModel,
} from '@shared/data-access/models'


export const selectPanelById = (props: { id: string }) =>
  createSelector(PanelsSelectors.selectAllPanels, (panels: GridPanelModel[]) =>
    panels.find((panel) => panel.id === props.id),
  )

export const selectBlockPanelById = (props: { id: string }) =>
  createSelector(PanelsSelectors.selectAllPanels, (panels: GridPanelModel[]) => {
    const panel = panels.find((panel) => panel.id === props.id)
    if (!panel) return undefined
    return {
      id: panel.id,
      stringId: panel.stringId,
      rotation: panel.rotation,
      location: panel.location,
    } as BlockPanelModel
  })

export const selectStringByPanelId = (props: { id: string }) =>
  createSelector(
    StringsSelectors.selectAllStrings,
    selectPanelById({ id: props.id }),
    (strings: GridStringModel[], panel?: GridPanelModel) => {
      if (!panel) return undefined
      return strings.find((string) => string.id === panel.stringId)
    },
  )
export const selectStringNameAndColorById = (props: { id: string }) =>
  createSelector(selectStringByPanelId({ id: props.id }), (string?: GridStringModel) => {
    if (!string) return undefined
    return { stringName: string.name, stringColor: string.color }
  })

export const selectPanelSelected = (props: { id: string }) =>
  createSelector(
    SelectedSelectors.selectSelectedId,
    SelectedSelectors.selectMultiSelectIds,
    (selectedPanelId, multiSelectIds) => {
      if (multiSelectIds?.includes(props.id)) {
        return PANEL_SELECTED.MULTI_SELECTED
      }
      if (selectedPanelId === props.id) {
        return PANEL_SELECTED.SINGLE_SELECTED
      }
      return PANEL_SELECTED.NOT_SELECTED
    },
  )

export const isPanelStringSelected = (props: { id: string }) =>
  createSelector(
    selectStringByPanelId({ id: props.id }),
    SelectedSelectors.selectSelectedStringId,
    (string, selectedStringId) => {
      if (!selectedStringId) return STRING_SELECTED.NOT_SELECTED
      if (selectedStringId && selectedStringId !== string?.id) return STRING_SELECTED.OTHER_SELECTED
      return STRING_SELECTED.SELECTED
    },
  )

export const selectPathByPanelId = (props: { panelId: string }) =>
  createSelector(PathsSelectors.selectAllPaths, (paths: PathModel[]) =>
    paths.find((path) => path.panelId === props.panelId),
  )

export const selectSelectedPanelLinkPathByPanelId = (props: { panelId: string }) =>
  createSelector(PathsSelectors.selectSelectedPanelLinkPath, (selectedPanelLinkPath) => {
    if (!selectedPanelLinkPath) return undefined
    return selectedPanelLinkPath.panelPaths.find((path) => path.panelId === props.panelId)
  })

export const isPanelToLink = (props: { panelId: string }) =>
  createSelector(
    LinksSelectors.selectLinksState,
    (state: LinksState) => state.toLinkId === props.panelId,
  )