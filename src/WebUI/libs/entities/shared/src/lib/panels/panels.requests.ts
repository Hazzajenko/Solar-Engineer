import { ProjectSignalrRequest } from '@app/data-access/signalr'
import { PANELS_SIGNALR_METHOD } from './panels.signalr.events'
import { PanelId, PanelModel } from './panel.model'
import { UpdateStr } from '@ngrx/entity/src/models'

export type CreatePanelRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.CREATE_PANEL
	payload: PanelModel
}

export type CreateManyPanelsRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.CREATE_MANY_PANELS
	payload: PanelModel[]
}

export type UpdatePanelRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.UPDATE_PANEL
	payload: UpdateStr<PanelModel>
}

export type UpdateManyPanelsRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.UPDATE_MANY_PANELS
	payload: UpdateStr<PanelModel>[]
}

export type DeletePanelRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.DELETE_PANEL
	payload: PanelId
}

export type DeleteManyPanelsRequest = ProjectSignalrRequest & {
	type: typeof PANELS_SIGNALR_METHOD.DELETE_MANY_PANELS
	payload: PanelId[]
}
