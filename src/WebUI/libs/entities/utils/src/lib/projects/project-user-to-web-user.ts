import { createRootServiceInjector } from '@shared/utils'
import { props, Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { combineLatest, forkJoin, map, of, OperatorFunction, pipe, switchMap, tap } from 'rxjs'
import { ProjectModel, ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
import { selectUsersByIdArray } from '@auth/data-access'
import { WebUserModel } from '@auth/shared'
import { Dictionary } from '@ngrx/entity'

export const mapProjectToWebProject = (projects: ProjectModel[], users: Dictionary<WebUserModel>) =>
	projects.map((project) => {
		const projectWebUsers = project.members
			.filter((member) => member.id !== props.appUserId)
			.map((member) => {
				const webUser = users[member.id]
				if (!webUser) {
					console.error(`Web user with id ${member.id} not found`)
					throw new Error(`Web user with id ${member.id} not found`)
				}
				return { ...member, ...webUser } as ProjectWebUserModel
			})
		return { ...project, members: projectWebUsers } as ProjectWebModel
	})

export const mapProjectToWebProjectExcludeAppUser = (
	projects: ProjectModel[],
	users: Dictionary<WebUserModel>,
	appUserId: string,
) =>
	projects.map((project) => {
		const projectWebUsers = project.members
			.filter((member) => member.id !== appUserId)
			.map((member) => {
				const webUser = users[member.id]
				if (!webUser) {
					console.error(`Web user with id ${member.id} not found`)
					throw new Error(`Web user with id ${member.id} not found`)
				}
				return { ...member, ...webUser } as ProjectWebUserModel
			})
		return { ...project, members: projectWebUsers } as ProjectWebModel
	})

export function injectMapProjectUsersToWebUsersFactory(): MapProjectUsersToWebUsersFactory {
	return mapProjectUsersToWebUsersFactoryInjector()
}

const mapProjectUsersToWebUsersFactoryInjector = createRootServiceInjector(
	mapProjectUsersToWebUsersFactory,
	{
		deps: [Store, HttpClient],
	},
)

export type MapProjectUsersToWebUsersFactory = ReturnType<typeof mapProjectUsersToWebUsersFactory>

function mapProjectUsersToWebUsersFactory(store: Store, http: HttpClient) {
	const mapProjectUsersToWebUsers = (): OperatorFunction<
		{
			projects: ProjectModel[]
		},
		ProjectWebModel[]
	> =>
		pipe(
			switchMap(({ projects }) => {
				const projectsWithInStoreWebUsers = projects.map((project) => {
					return store.select(selectUsersByIdArray({ ids: project.memberIds })).pipe(
						map((webUsers) => {
							const projectWebUsers = webUsers.map((webUser) => {
								const existingProjectUser = project.members.find(
									(projectMember) => projectMember.id === webUser.id,
								)
								return {
									...existingProjectUser,
									...webUser,
								} as ProjectWebUserModel
							})
							return {
								...project,
								members: projectWebUsers,
							}
						}),
					)
				})
				return forkJoin(projectsWithInStoreWebUsers)
			}),
			switchMap((projects) => {
				const projectsWithMissingWebUsers = projects.filter((project) => {
					return project.memberIds.filter(
						(id) => !project.members.find((member) => member.id === id),
					)
				})
				const projectsWithInStoreWebUsers = projects.filter((project) => {
					return !projectsWithMissingWebUsers.find((proj) => proj.id === project.id)
				})
				if (projectsWithMissingWebUsers.length === 0) return of(projectsWithInStoreWebUsers)
				const webMembersIdsNotLoaded = projectsWithMissingWebUsers.map(
					(project) => project.memberIds,
				)
				const appUserIds = webMembersIdsNotLoaded.reduce((acc, curr) => [...acc, ...curr], [])
				if (appUserIds.length === 0) return of(projectsWithInStoreWebUsers)
				const projectsWithFetchedWebUsers = of(projectsWithMissingWebUsers).pipe(
					switchMap((projects) => {
						const projectsWithInStoreWebUsers = projects.map((project) => {
							return http
								.get<{
									appUsers: WebUserModel[]
								}>('/auth/users', { params: { appUserIds } })
								.pipe(
									tap((res) => console.log(res)),
									map(({ appUsers }) => {
										const members = project.members.map((projectWebUser) => {
											const webUser = appUsers.find((appUser) => appUser.id === projectWebUser.id)
											if (!webUser) return projectWebUser
											return {
												...webUser,
												...projectWebUser,
											}
										})
										return { ...project, members }
									}),
								)
						})
						return forkJoin(projectsWithInStoreWebUsers)
					}),
				)
				return combineLatest([of(projectsWithInStoreWebUsers), projectsWithFetchedWebUsers]).pipe(
					map(([projectsWithInStoreWebUsers, projectsWithFetchedWebUsers]) => {
						return [...projectsWithInStoreWebUsers, ...projectsWithFetchedWebUsers]
					}),
				)
			}),
			tap((res) => console.log(res)),
		)

	return {
		mapProjectUsersToWebUsers,
	}
}
