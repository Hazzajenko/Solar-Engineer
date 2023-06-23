import { StringBackendModel } from '../strings'
import { PanelBackendModel } from '../panels'
import { PanelLinkBackendModel } from '../panel-links'
import { PanelConfigModel } from '../panel-configs'
import { WebUserModel } from '@auth/shared'

export type ProjectModel = {
	id: ProjectId
	name: string
	colour: string
	memberIds: string[]
	members: ProjectUserModel[]
	createdTime: string
	undefinedStringId: string
	lastModifiedTime: string
	createdById: string
}

export type ProjectId = string & {
	readonly _type: 'projectId'
}

export type ProjectUserModel = {
	id: ProjectUserId
	role: ProjectUserRole
	canCreate: boolean
	canDelete: boolean
	canInvite: boolean
	canKick: boolean
	joinedAtTime: string
}

export type ProjectMemberPermissions = {
	canCreate: boolean
	canInvite: boolean
	canKick: boolean
	canDelete: boolean
}

export type ProjectWebModel = Omit<ProjectModel, 'members'> & {
	members: ProjectWebUserModel[]
}

export type ProjectWebUserModel = ProjectUserModel & WebUserModel

export type ProjectUserId = string & {
	readonly _type: 'projectUserId'
}

export type ProjectUserRole = 'Owner' | 'Admin' | 'Member'

export type GetProjectDataResponse = {
	id: string
	name: string
	strings: StringBackendModel[]
	panels: PanelBackendModel[]
	panelLinks: PanelLinkBackendModel[]
	panelConfigs: PanelConfigModel[]
	createdTime: string
	lastModifiedTime: string
	createdById: string
}
