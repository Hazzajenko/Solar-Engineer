import { Injectable } from '@angular/core'
import {
	PanelConfigModel,
	PanelLinkModel,
	PanelModel,
	PROJECT_LOCAL_STORAGE_MODEL,
	ProjectEntities,
	ProjectLocalStorageModel,
	StringModel,
} from '@entities/shared'
import { ProjectLocalStorageAction } from '@entities/utils'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
	providedIn: 'root',
})
export class ProjectsLocalStorageService {
	private updateLastModified = () =>
		localStorage.setItem('lastModifiedTime', JSON.stringify(new Date().toISOString()))

	fetchExistingProject() {
		const modelKeys = Object.keys(PROJECT_LOCAL_STORAGE_MODEL)
		const projectLocalStorage: ProjectLocalStorageModel = {
			panels: this.getObjectFromLocalStorage(
				'panels',
				PROJECT_LOCAL_STORAGE_MODEL.panels,
			) as PanelModel[],
			panelConfigs: this.getObjectFromLocalStorage(
				'panelConfigs',
				PROJECT_LOCAL_STORAGE_MODEL.panelConfigs,
			) as PanelConfigModel[],
			panelLinks: this.getObjectFromLocalStorage(
				'panelLinks',
				PROJECT_LOCAL_STORAGE_MODEL.panelLinks,
			) as PanelLinkModel[],
			strings: this.getObjectFromLocalStorage(
				'strings',
				PROJECT_LOCAL_STORAGE_MODEL.strings,
			) as StringModel[],
			createdTime: this.getStringFromLocalStorage('createdTime') as string,
			lastModifiedTime: this.getStringFromLocalStorage('lastModifiedTime') as string,
		}
		/*const projectLocalStorage = modelKeys
		 .filter((key) => key !== 'createdTime' && key !== 'lastModifiedTime')
		 .map((key) => {
		 const storedItem = localStorage.getItem(key)
		 console.log('storedItem', storedItem, key)
		 if (!storedItem) return
		 const parsed = PROJECT_LOCAL_STORAGE_MODEL[
		 key as keyof typeof PROJECT_LOCAL_STORAGE_MODEL
		 ].safeParse(JSON.parse(storedItem))
		 console.log(key, parsed)
		 if (!parsed.success) throw new Error(parsed.error.message)
		 return parsed.data
		 })
		 .reduce((acc, curr, i) => {
		 if (!curr) return acc
		 return {
		 ...acc,
		 [modelKeys[i]]: curr,
		 }
		 }, {} as ProjectLocalStorageModel)
		 projectLocalStorage.createdTime = localStorage.getItem('createdTime') || ''
		 projectLocalStorage.lastModifiedTime = localStorage.getItem('lastModifiedTime') || ''*/
		console.log('projectLocalStorage', projectLocalStorage)
		return projectLocalStorage
	}

	getObjectFromLocalStorage(
		key: string,
		schema: (typeof PROJECT_LOCAL_STORAGE_MODEL)[keyof typeof PROJECT_LOCAL_STORAGE_MODEL],
	) {
		const storedItem = localStorage.getItem(key)
		if (!storedItem) return
		const parsed = schema.safeParse(JSON.parse(storedItem))
		if (!parsed.success) throw new Error(parsed.error.message)
		return parsed.data
	}

	getStringFromLocalStorage(key: string) {
		return localStorage.getItem(key)
	}

	getProjectDataByKey<T extends keyof ProjectEntities>(key: T) {
		const storedItem = localStorage.getItem(key)
		if (!storedItem) throw new Error(`No data found for key ${key}`)
		const parsed = PROJECT_LOCAL_STORAGE_MODEL[key].safeParse(JSON.parse(storedItem))
		if (!parsed.success) throw new Error(parsed.error.message)
		return parsed.data as ProjectEntities[T]
	}

	addProjectItem<TKey extends keyof ProjectEntities, TEntity extends ProjectEntities[TKey][number]>(
		key: TKey,
		item: TEntity,
	) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		dataByKey.push(item)
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	addManyProjectItems<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, items: TEntity[]) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		dataByKey.push(...items)
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	updateProjectItem<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, item: UpdateStr<TEntity>) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		const index = dataByKey.findIndex((i) => i.id === item.id)
		if (index === -1) throw new Error(`No item found with id ${item.id}`)
		const changes = item.changes
		dataByKey[index] = {
			...dataByKey[index],
			...changes,
		}
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	updateManyProjectItems<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, items: UpdateStr<TEntity>[]) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		items.forEach((item) => {
			const index = dataByKey.findIndex((i) => i.id === item.id)
			if (index === -1) throw new Error(`No item found with id ${item.id}`)
			const changes = item.changes
			dataByKey[index] = {
				...dataByKey[index],
				...changes,
			}
		})
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	deleteProjectItem<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, itemId: TEntity['id']) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		const index = dataByKey.findIndex((i) => i.id === itemId)
		if (index === -1) throw new Error(`No item found with id ${itemId}`)
		dataByKey.splice(index, 1)
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	deleteManyProjectItems<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, itemIds: TEntity['id'][]) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		itemIds.forEach((itemId) => {
			const index = dataByKey.findIndex((i) => i.id === itemId)
			if (index === -1) throw new Error(`No item found with id ${itemId}`)
			dataByKey.splice(index, 1)
		})
		localStorage.setItem(key, JSON.stringify(dataByKey))
		this.updateLastModified()
	}

	initNewProject() {
		const project: ProjectLocalStorageModel = {
			createdTime: new Date().toISOString(),
			lastModifiedTime: new Date().toISOString(),
			strings: [],
			panels: [],
			panelLinks: [],
			panelConfigs: [],
		}

		Object.keys(project).forEach((key) => {
			localStorage.setItem(key, JSON.stringify(project[key as keyof typeof project]))
		})
		return project
	}

	setProject(project: ProjectLocalStorageModel) {
		localStorage.setItem('project', JSON.stringify(project))
	}

	setProjectEntities(entities: ProjectEntities) {
		Object.keys(entities).forEach((key) => {
			const entity = entities[key as keyof ProjectEntities]
			localStorage.setItem(key, JSON.stringify(entity))
		})
		localStorage.setItem('lastModifiedTime', new Date().toISOString())
		localStorage.setItem('createdTime', new Date().toISOString())
	}

	appActionController(action: ProjectLocalStorageAction) {
		console.log('appActionController', action)
		switch (action.type) {
			case '[Panels Store] Add Panel':
				this.addProjectItem('panels', action.panel)
				break
			case '[Panels Store] Update Panel':
				this.updateProjectItem('panels', action.update)
				break
			case '[Panels Store] Delete Panel':
				this.deleteProjectItem('panels', action.panelId)
				break
			case '[Panels Store] Add Many Panels':
				this.addManyProjectItems('panels', action.panels)
				break
			case '[Panels Store] Update Many Panels':
				this.updateManyProjectItems('panels', action.updates)
				break
			case '[Panels Store] Delete Many Panels':
				this.deleteManyProjectItems('panels', action.panelIds)
				break
			case '[Panels Store] Update Many Panels With String':
				this.updateManyProjectItems('panels', action.updates)
				break
			case '[Strings Store] Add String':
				this.addProjectItem('strings', action.string)
				break
			case '[Strings Store] Update String':
				this.updateProjectItem('strings', action.update)
				break
			case '[Strings Store] Delete String':
				this.deleteProjectItem('strings', action.stringId)
				break
			case '[Strings Store] Add Many Strings':
				this.addManyProjectItems('strings', action.strings)
				break
			case '[Strings Store] Update Many Strings':
				this.updateManyProjectItems('strings', action.updates)
				break
			case '[Strings Store] Delete Many Strings':
				this.deleteManyProjectItems('strings', action.stringIds)
				break
			case '[Strings Store] Add String With Panels':
				this.addProjectItem('strings', action.string)
				// this.updateManyProjectItems('panels', action.panelUpdates)
				break
			case '[PanelLinks Store] Add Panel Link':
				this.addProjectItem('panelLinks', action.panelLink)
				break
			case '[PanelLinks Store] Update Panel Link':
				this.updateProjectItem('panelLinks', action.update)
				break
			case '[PanelLinks Store] Delete Panel Link':
				this.deleteProjectItem('panelLinks', action.panelLinkId)
				break
			case '[PanelLinks Store] Add Many Panel Links':
				this.addManyProjectItems('panelLinks', action.panelLinks)
				break
			case '[PanelLinks Store] Update Many Panel Links':
				this.updateManyProjectItems('panelLinks', action.updates)
				break
			case '[PanelLinks Store] Delete Many Panel Links':
				this.deleteManyProjectItems('panelLinks', action.panelLinkIds)
				break
			case '[PanelConfigs Store] Add PanelConfig':
				this.addProjectItem('panelConfigs', action.panelConfig)
				break
			case '[PanelConfigs Store] Update PanelConfig':
				this.updateProjectItem('panelConfigs', action.update)
				break
			case '[PanelConfigs Store] Delete PanelConfig':
				this.deleteProjectItem('panelConfigs', action.panelConfigId)
				break
			case '[PanelConfigs Store] Add Many PanelConfigs':
				this.addManyProjectItems('panelConfigs', action.panelConfigs)
				break
			case '[PanelConfigs Store] Update Many PanelConfigs':
				this.updateManyProjectItems('panelConfigs', action.updates)
				break
			case '[PanelConfigs Store] Delete Many PanelConfigs':
				this.deleteManyProjectItems('panelConfigs', action.panelConfigIds)
				break
			default:
				throw new Error(`Action type not handled`)
		}
	}

	updatePanel(panel: ProjectLocalStorageModel['panels'][number]) {
		const project = this.fetchExistingProject()
		if (!project) return
		const index = project.panels.findIndex((p) => p.id === panel.id)
		if (index === -1) return
		project.panels[index] = panel
		this.setProject(project)
	}

	isProjectExisting() {
		return Object.keys(PROJECT_LOCAL_STORAGE_MODEL).every((key) => {
			return !!localStorage.getItem(key)
		})
	}
}
