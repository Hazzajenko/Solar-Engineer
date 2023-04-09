import {
  GridPanelModel,
  GridStringModel,
  PanelLinkModel,
  ProjectModel,
} from '@shared/data-access/models'

export interface GetProjectByIdResponse {
  project: ProjectModel
  strings: GridStringModel[]
  panels: GridPanelModel[]
  links: PanelLinkModel[]
}