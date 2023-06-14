/*
 import { ComponentStore } from '@ngrx/component-store'
 import { ContextMenuInput, uiFeature } from '@overlays/ui-store/data-access'
 import { selectProjectsEntities } from '@entities/data-access'
 import { authFeature, selectUsersEntities } from '@auth/data-access'
 import { Dictionary } from '@ngrx/entity'
 import { ProjectModel, ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
 import { AppUserModel } from '@shared/data-access/models'
 import { WebUserModel } from '@auth/shared'
 import { Injectable } from '@angular/core'

 export interface ContextMenuProjectState {
 webProject2: ProjectWebModel
 }

 @Injectable()
 export class ContextMenuProjectStore extends ComponentStore<ContextMenuProjectState> {
 private readonly currentContextMenu = this.selectSignal(uiFeature.selectCurrentContextMenu)
 private readonly projects = this.selectSignal(selectProjectsEntities)
 private readonly appUser = this.selectSignal(authFeature.selectUser)
 private readonly users = this.selectSignal(selectUsersEntities)
 readonly webProject = this.selectSignal(
 this.currentContextMenu,
 this.projects,
 this.appUser,
 this.users,
 (
 contextMenuInput: ContextMenuInput | undefined,
 projects: Dictionary<ProjectModel>,
 appUser: AppUserModel | undefined,
 users: Dictionary<WebUserModel>,
 ) => {
 if (!appUser) return undefined
 if (!contextMenuInput) return undefined
 if (!('projectId' in contextMenuInput.data)) return undefined
 const project = projects[contextMenuInput.data.projectId]
 if (!project) return undefined
 const projectWebUsers = project.members
 .filter((member) => member.id !== (appUser.id as string))
 .map((member) => {
 const webUser = users[member.id]
 if (!webUser) {
 console.error(`Web user with id ${member.id} not found`)
 throw new Error(`Web user with id ${member.id} not found`)
 }
 return { ...member, ...webUser } as ProjectWebUserModel
 })
 return { ...project, members: projectWebUsers } as ProjectWebModel
 },
 )
 // webProject = this.selectSignal(this.webProject$)
 // readonly webProjects$: Observable<Movie[]> = this.select((state) => state.movies)
 }

 /!*

 const selectWebProjectByIdExcludeUserFromMembersByContextMenuData = createSelector(
 uiFeature.selectCurrentContextMenu,
 selectProjectsEntities,
 authFeature.selectUser,
 selectUsersEntities,
 (
 contextMenuInput: ContextMenuInput | undefined,
 projects: Dictionary<ProjectModel>,
 appUser: AppUserModel | undefined,
 users: Dictionary<WebUserModel>,
 ) => {
 if (!appUser) return undefined
 if (!contextMenuInput) return undefined
 if (!('projectId' in contextMenuInput.data)) return undefined
 const project = projects[contextMenuInput.data.projectId]
 if (!project) return undefined
 const projectWebUsers = project.members
 .filter((member) => member.id !== (appUser.id as string))
 .map((member) => {
 const webUser = users[member.id]
 if (!webUser) {
 console.error(`Web user with id ${member.id} not found`)
 throw new Error(`Web user with id ${member.id} not found`)
 }
 return { ...member, ...webUser } as ProjectWebUserModel
 })
 return { ...project, members: projectWebUsers } as ProjectWebModel
 },
 )
 *!/
 */
