import { ProjectId, ProjectModel } from '@entities/shared'

export const addProjectId = <T extends object>(project: ProjectModel | ProjectId, object: T) => {
	if (typeof project === 'string') {
		return {
			...object,
			projectId: project,
		}
	} else {
		return {
			...object,
			projectId: project.id,
		}
	}
}
