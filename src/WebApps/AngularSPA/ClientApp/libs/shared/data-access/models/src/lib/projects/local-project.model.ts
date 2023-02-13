import { PanelLinkModel } from './panel-link.model'
import { PanelModel } from './panel.model'
import { ProjectModel } from './project.model'
import { StringModel } from './string.model'

export interface LocalProjectModel {
  project: ProjectModel
  panels: PanelModel[]
  links: PanelLinkModel[]
  strings: StringModel[]
}
