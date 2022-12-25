import { PanelLinkModel, PanelModel, ProjectModel, StringModel } from '@shared/data-access/models'

export interface GetProjectByIdResponse {
  project: ProjectModel
  strings: StringModel[]
  panels: PanelModel[]
  links: PanelLinkModel[]
}
