import { PanelLinkModel } from '@shared/data-access/models'

export interface ManyLinksResponse {
  links: PanelLinkModel[]
}

export interface LinkResponse {
  link: PanelLinkModel
}

export interface DeleteLinkResponse {
  linkId: string
}
