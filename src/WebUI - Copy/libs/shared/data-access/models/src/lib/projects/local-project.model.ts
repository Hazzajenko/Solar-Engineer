import { GridPanelModel } from './panel'
import { PanelLinkModel } from './panel-link.model'
import { ProjectModel } from './project'
// import { ProjectModel } from './project.model'
import { GridStringModel } from './string'

export interface LocalProjectModel {
  project: ProjectModel
  panels: GridPanelModel[]
  links: PanelLinkModel[]
  strings: GridStringModel[]
}