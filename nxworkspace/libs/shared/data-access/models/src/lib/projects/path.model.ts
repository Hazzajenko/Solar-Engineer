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

export interface PathOptions {
  id?: string
  projectId: number
  stringId: string
  panelId: string
  link: number
  count: number
  color: string
  // panelPath: PanelPathModel
}

export class PathModel {
  id: string
  projectId: number
  stringId: string
  panelId: string
  link: number
  count: number
  color: string

  // panelPath: PanelPathModel

  constructor(options: PathOptions) {
    this.id = options.id ? options.id : getGuid().toString()
    this.projectId = options.projectId
    this.stringId = options.stringId
    this.panelId = options.panelId
    this.link = options.link
    this.count = options.count
    this.color = options.color
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