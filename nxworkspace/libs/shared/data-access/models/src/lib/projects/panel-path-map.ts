import { getGuid } from '@shared/utils'

export type PanelPathModel = {
  link: number
  count: number
  color: string
}

/*export type PanelLinkPath = {
  count: number
}*/


/*
export type PanelId = string

export type PanelPathMap = Map<
  PanelId,
  PanelPathModel
>

export type PanelPathObject = { [panelId: string]: PanelPathModel }
export type PanelPathObject2 = { [panelId: string]: [count: string] }
export type PanelPathRecord = Record<PanelId, PanelPathModel>
// export type PanelPath = [[panelId: PanelId], [path: StringPanelLinkPath]][]
export type PanelPath = {
  panelId: string
  path: PanelPathModel
}
*/

// export t
// ype PanelPath = [[panelId: PanelId], [path: StringPanelLinkPath]][]


export type PanelIdPath = {
  panelId: string
  path: PanelPathModel
}

export interface PanelLinkPathOptions {
  id?: string
  projectId: number
  stringId: string
  panelId: string
  panelPath: PanelPathModel
}

export class PanelLinkPathModel {
  id: string
  projectId: number
  stringId: string
  panelId: string
  path: PanelPathModel

  constructor(options: PanelLinkPathOptions) {
    this.id = options.id ? options.id : getGuid().toString()
    this.projectId = options.projectId
    this.stringId = options.stringId
    this.panelId = options.panelId
    this.path = options.panelPath
  }
}

/*

export type StringLinkPaths = {
  id: string
  stringId: string
  link: number
  color: string
  paths: PanelPathObject2
}

const dude: PanelPathObject = {
  'asdsa': {
    count: 1,
    link: 1,
    color: '',
  },
  'assdsa': {
    count: 1,
    link: 1,
    color: '',
  },
}

const yes = dude['asdsa']*/
