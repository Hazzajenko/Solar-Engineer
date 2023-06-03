import { ProjectUserModel } from './project-user.model'

export type ProjectModel = {
	id: ProjectId
	name: string
	memberIds: string[]
	members: ProjectUserModel[]
	createdTime: string
	lastModifiedTime: string
	createdById: string
}

export type ProjectId = string & {
	readonly _type: 'projectId'
}
