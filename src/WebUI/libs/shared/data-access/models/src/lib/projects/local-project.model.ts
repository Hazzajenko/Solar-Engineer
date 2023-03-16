import { PanelLinkModel } from './panel-link.model'
import { PanelModel } from './panel'
// import { ProjectModel } from './project.model'
import { StringModel } from './string'
import { ProjectModel } from './project'

export interface LocalProjectModel {
  project: ProjectModel
  panels: PanelModel[]
  links: PanelLinkModel[]
  strings: StringModel[]
}
