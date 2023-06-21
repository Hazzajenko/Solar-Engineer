import { PanelLinkModel } from './panel-link.model'
import { UpdateStr } from '@ngrx/entity/src/models'

export type CreatePanelLinkSignalrRequest = {
	projectId: string
	panelLink: PanelLinkModel
}

export type UpdateManyPanelLinksSignalrRequest = {
	projectId: string
	updates: UpdateStr<PanelLinkModel>[]
}

export type DeletePanelLinkSignalrRequest = {
	projectId: string
	panelLinkId: string
}
