import { PanelLinkModel, PanelModel, ProjectModel, StringModel } from '@shared/data-access/models'

export interface LocalProjectModel {
  project: ProjectModel
  panels: PanelModel[]
  links: PanelLinkModel[]
  strings: StringModel[]
}
