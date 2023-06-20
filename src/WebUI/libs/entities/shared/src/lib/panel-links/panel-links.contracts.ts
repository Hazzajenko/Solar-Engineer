import { EntityUpdate } from '@shared/data-access/models'
import { PanelLinkModel } from './panel-link.model'

export type CreatePanelLinkRequest = {
	id: string
	projectId: string
	panelLink: PanelLinkModel
}

export type UpdateManyPanelLinksRequest = {
	projectId: string
	updates: EntityUpdate<PanelLinkModel>[]
}

export type DeletePanelLinkRequest = {
	projectId: string
	panelLinkId: string
}
