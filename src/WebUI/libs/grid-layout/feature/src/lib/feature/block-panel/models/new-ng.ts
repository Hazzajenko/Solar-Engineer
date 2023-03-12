import { PanelModel, PathModel, SelectedPathModel } from '@shared/data-access/models'
import { SelectedPanelVal, StringSelectedVal } from './panel-ng.model'
import { LinkedToSelected } from './is-panel-linked-to-selected'

export interface BlockPanelStateModel {
  panel: PanelModel
  selected: SelectedPanelVal
  linkedToSelected: LinkedToSelected
  links: {
    isToLinkId: boolean
    // isFromLinkId: boolean
    linkPath: PathModel | undefined
    selectedLinkPath: SelectedPathModel | undefined
  }
  string: {
    name: string
    color: string
    selected: StringSelectedVal
    selectedTooltip: string | undefined
  }
}

/*
panelLinkPath(id: string) {
  return this.pathsFacade.pathByPanelId$(id)
}


selectedPanelLinkPath$(id: string) {
  return this.pathsFacade.selectedPanelLinkPath$.pipe(
    map((selectedPath) => {
      if (!selectedPath) return undefined
      return selectedPath.panelPaths.find((panel) => panel.panelId === id)
    }),
  )
}

isToLinkId$(id: string) {
  return this.linksFacade.toLinkId$.pipe(
    map((toLinkId) => {
      return toLinkId === id
    }),
  )
}*/
