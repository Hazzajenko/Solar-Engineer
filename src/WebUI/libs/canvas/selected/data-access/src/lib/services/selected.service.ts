import { ENTITY_SELECTED_STATE, injectSelectedStore } from '../store'
import { Injectable } from '@angular/core'
import { assertNotNull } from '@shared/utils'
import { injectEntityStore } from '@entities/data-access'
import { PanelId, PanelModel } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class SelectedService {
	private _entities = injectEntityStore()
	private _selectedStore = injectSelectedStore()

	// private _selectedStore = inject(SelectedStoreService)

	handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: PanelModel) {
		if (event.shiftKey) {
			this.addToMultiSelected(entityUnderMouse.id)
			return
		}
		this.setSelected(entityUnderMouse.id)
		return
	}

	handleEntityUnderTouch(event: TouchEvent, entityUnderMouse: PanelModel) {
		this.setSelected(entityUnderMouse.id)
		return
	}

	setSelected(selectedId: PanelId) {
		this._selectedStore.dispatch.selectPanel(selectedId)
		console.log('set selected', selectedId)
	}

	addToMultiSelected(selectedId: PanelId) {
		const multipleSelectedIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedIds.includes(selectedId)) {
			this._selectedStore.dispatch.removePanelsFromMultiSelect([selectedId])
			return
		}

		if (!selectedId) return

		const selectedEntity = this._entities.panels.select.getById(selectedId)
		assertNotNull(selectedEntity, 'selected entity not found')
		this._selectedStore.dispatch.addPanelsToMultiSelect([...multipleSelectedIds, selectedId])
	}

	handleNotClickedOnEntity() {
		const entitySelectedState = this._selectedStore.select.entityState()
		if (entitySelectedState === ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED) {
			this._selectedStore.dispatch.clearMultipleSelected()
			return
		}

		if (entitySelectedState === ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED) {
			this._selectedStore.dispatch.clearSingleSelected()
			return
		}
	}

	clearSingleOrMultipleSelected() {
		this._selectedStore.dispatch.clearSingleSelected()
		this._selectedStore.dispatch.clearMultipleSelected()
	}

	clearSelectedInOrder() {
		if (this._selectedStore.select.selectedStringId()) {
			this._selectedStore.dispatch.clearSelectedString()
			return
		}

		if (
			this._selectedStore.select.entityState() === ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED
		) {
			this._selectedStore.dispatch.clearMultipleSelected()
			return
		}

		if (this._selectedStore.select.entityState() === ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED) {
			this._selectedStore.dispatch.clearSingleSelected()
			return
		}
	}
}
