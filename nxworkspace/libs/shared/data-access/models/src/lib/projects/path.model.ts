import { getGuid } from '@shared/utils'

export interface PanelPathModel {
  link: number
  count: number
  color: string
}


export interface PanelIdPath {
  panelId: string
  path: PanelPathModel
}

export interface StringLinkPathOptions {
  id?: string
  projectId: number
  stringId: string
  panelId: string
  panelPath: PanelPathModel
}

export class StringLinkPathModel {
  id: string
  projectId: number
  stringId: string
  panelId: string
  panelPath: PanelPathModel

  constructor(options: StringLinkPathOptions) {
    this.id = options.id ? options.id : getGuid().toString()
    this.projectId = options.projectId
    this.stringId = options.stringId
    this.panelId = options.panelId
    this.panelPath = options.panelPath
  }
}

export interface SelectedPathModel {
  panelId: string
  count: number
}

export interface SelectedPanelLinkPathModel {
  selectedPanelId: string
  panelPaths: SelectedPathModel[]
}