import { UpdateStr } from '@ngrx/entity/src/models'
import { PanelConfigId, PanelId, PanelModel, ProjectId, StringId } from '@entities/shared'
import { AngleRadians } from '@shared/data-access/models'

export interface CreatePanelSignalrRequest {
	projectId: string
	panel: PanelModel
}

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

export interface UpdatePanelSignalrRequest {
	projectId: ProjectId
	update: UpdateStr<PanelModel>
}

export interface UpdateManyPanelsSignalrRequest {
	projectId: ProjectId
	updates: UpdateStr<PanelModel>[]
}

export interface DeletePanelSignalrRequest {
	projectId: ProjectId
	panelId: PanelId
}

export interface DeleteManyPanelsSignalrRequest {
	projectId: ProjectId
	panelIds: PanelId[]
}
