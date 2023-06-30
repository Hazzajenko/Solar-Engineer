import { Injectable } from '@angular/core'
import {
	PROJECT_LOCAL_STORAGE_MODEL,
	ProjectEntities,
	ProjectLocalStorageModel,
} from '@entities/shared'
import { ProjectLocalStorageAction } from '@entities/utils'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
	providedIn: 'root',
})
export class ProjectsLocalStorageService {
	fetchExistingProject() {
		// if (!this.isProjectExisting()) {
		// 	this.initNewProject()
		// }

		const modelKeys = Object.keys(PROJECT_LOCAL_STORAGE_MODEL)

		return modelKeys
			.map((key) => {
				const storedItem = localStorage.getItem(key)
				if (!storedItem) return
				const parsed = PROJECT_LOCAL_STORAGE_MODEL[
					key as keyof typeof PROJECT_LOCAL_STORAGE_MODEL
				].safeParse(JSON.parse(storedItem))
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
	}

	addManyProjectItems<
		TKey extends keyof ProjectEntities,
		TEntity extends ProjectEntities[TKey][number],
	>(key: TKey, items: TEntity[]) {
		const dataByKey = this.getProjectDataByKey<TKey>(key) as Array<TEntity>
		dataByKey.push(...items)
		localStorage.setItem(key, JSON.stringify(dataByKey))
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
	}

	pushItemToArray<T>(array: T[], item: T) {
		array.push(item)
	}

	initNewProject() {
		const project: ProjectLocalStorageModel = {
			project: {
				createdTime: new Date().toISOString(),
				lastModifiedTime: new Date().toISOString(),
			},
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

	appActionControllerV2(action: ProjectLocalStorageAction) {
		// operation and entity type is extracted from the action type
		const [, entity, operation] = /\[(\w+)\sStore\]\s(.+)\s(\w+)/.exec(action.type) || []
		console.log('appActionControllerV2', action, entity, operation)

		// entity type is transformed to camelCase
		const entityType = entity.charAt(0).toLowerCase() + entity.slice(1)

		// Mapping operation type to method
		const operationMethods: Record<string, keyof this> = {
			Add: 'addProjectItem',
			Update: 'updateProjectItem',
			Delete: 'deleteProjectItem',
			'Add Many': 'addManyProjectItems',
			'Update Many': 'updateManyProjectItems',
			'Delete Many': 'deleteManyProjectItems',
		}

		const method = operationMethods[operation]

		// check if operation type is correct
		if (!method) {
			throw new Error(`Operation type not handled`)
		}

		// call the correct method based on the operation type
		if (entity.includes('Many')) {
			const property = entity.toLowerCase() + 's'
			if (property in action) {
				this[method](entityType, action[property as keyof typeof action])
			}
		} else {
			if (entity === 'Delete') {
				const property = entity.toLowerCase() + 'Id'
				this[method](entityType, action[property as keyof typeof action])
				return
			}
			const property = entity.toLowerCase()
			this[method](entityType, action[property as keyof typeof action])
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

	removeProject() {
		localStorage.removeItem('project')
	}

	// private

	isProjectExisting() {
		return Object.keys(PROJECT_LOCAL_STORAGE_MODEL).every((key) => {
			return !!localStorage.getItem(key)
		})
	}
}
