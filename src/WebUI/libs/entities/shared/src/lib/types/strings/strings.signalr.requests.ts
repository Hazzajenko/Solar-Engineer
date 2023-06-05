import { StringId, StringModel } from './string.model'
import { ProjectId } from '../projects'
import { PanelModel } from '../panels'
import { EntityUpdate } from '@shared/data-access/models'

export interface CreateStringSignalrRequest {
	projectId: ProjectId
	string: Pick<StringModel, 'id' | 'name' | 'colour' | 'parallel'>
	panelUpdates: EntityUpdate<PanelModel>[]
}

export interface DeleteStringSignalrRequest {
	projectId: ProjectId
	stringId: StringId
}
