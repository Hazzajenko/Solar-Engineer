import { UpdateStr } from '@ngrx/entity/src/models'
import { AngleRadians, POINT } from '@shared/data-access/models'
import { z } from 'zod'
import { PANEL_MODEL, PanelId, PanelModel } from './panel.model'
import { ProjectId } from '../projects'
import { StringId } from '../strings'
import { PanelConfigId } from '../panel-configs'

export interface CreatePanelSignalrRequest {
	projectId: string
	panel: PanelModel
}

export const CREATE_PANEL_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	panel: PANEL_MODEL,
})

/*export interface CreateManyPanelsSignalrRequest {
 projectId: ProjectId
 panels: PanelModel[]
 }*/

export interface CreateManyPanelsSignalrRequest {
	projectId: ProjectId
	stringId: StringId
	panelConfigId: PanelConfigId
	angle: AngleRadians
	panels: Pick<PanelModel, 'id' | 'location'>[]
}

export const CREATE_MANY_PANELS_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	stringId: z.string(),
	panelConfigId: z.string(),
	angle: z.number(),
	panels: z.array(
		z.object({
			id: z.string(),
			location: POINT,
		}),
	),
})

export interface UpdatePanelSignalrRequest {
	projectId: ProjectId
	update: UpdateStr<PanelModel>
}

export const UPDATE_PANEL_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	update: z.object({
		id: z.string(),
		changes: PANEL_MODEL.partial().nonstrict(),
	}),
})

export interface UpdateManyPanelsSignalrRequest {
	projectId: ProjectId
	updates: UpdateStr<PanelModel>[]
}

export const UPDATE_MANY_PANELS_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	updates: z.array(
		z.object({
			id: z.string(),
			changes: PANEL_MODEL.partial().nonstrict(),
		}),
	),
})

export interface DeletePanelSignalrRequest {
	projectId: ProjectId
	panelId: PanelId
}

export const DELETE_PANEL_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	panelId: z.string(),
})

export interface DeleteManyPanelsSignalrRequest {
	projectId: ProjectId
	panelIds: PanelId[]
}

export const DELETE_MANY_PANELS_SIGNALR_REQUEST = z.object({
	projectId: z.string(),
	panelIds: z.array(z.string()),
})
