import { createSelector } from '@ngrx/store'
import { selectAllProjects, selectSelectedProjectId } from '@entities/data-access'
import { selectAllUsersMappedWithConnections } from '@auth/data-access'
import { ProjectId, ProjectModel, ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
import { WebUserModel } from '@auth/shared'

export const selectAllWebProjects = createSelector(
	selectAllProjects,
	selectAllUsersMappedWithConnections,
	(projects: ProjectModel[], users: WebUserModel[]) =>
		projects.map((project) => {
			const projectWebUsers = project.members.map((member) => {
				const webUser = users.find((user) => user.id === member.id)
				// console.log(webUser)
				if (!webUser) {
					console.error(`Web user with id ${member.id} not found`)
					throw new Error(`Web user with id ${member.id} not found`)
				}
				return { ...member, ...webUser } as ProjectWebUserModel
			})
			return { ...project, members: projectWebUsers } as ProjectWebModel
		}),
)

export const selectSelectedWebProject = createSelector(
	selectAllWebProjects,
	selectSelectedProjectId,
	(projects: ProjectWebModel[], selectedProjectId: ProjectId | undefined) => {
		return projects.find((project) => project.id === selectedProjectId)
	},
)
