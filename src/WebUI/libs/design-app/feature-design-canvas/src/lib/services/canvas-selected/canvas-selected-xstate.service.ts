import { inject, Injectable } from '@angular/core'
import { CanvasEntity } from '../../types'
import { assertNotNull } from '@shared/utils'
// import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasAppStateStore } from '../canvas-app-state'
import { AddEntitiesToMultipleSelected, CancelSelected, ClearEntitySelected, InjectClientState, MachineService, RemoveEntitiesFromMultipleSelected, SelectedSingleEntity } from '../canvas-client-state'

@Injectable({
	providedIn: 'root',
})
export class CanvasSelectedXstateService {
	private _entityStore = inject(CanvasAppStateStore)
	private _state = InjectClientState()
	private _machine = inject(MachineService)

	handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: CanvasEntity) {
		if (event.shiftKey) {
			this.addToMultiSelected(entityUnderMouse.id)
			return
		}
		this.setSelected(entityUnderMouse.id)
		return
	}

	setSelected(selectedId: string) {
		this._machine.sendEvent(new SelectedSingleEntity({ id: selectedId }))
		console.log('set selected', selectedId)
	}

	addToMultiSelected(selectedId: string) {

		const singleSelectedId = this._machine.ctx.selected.singleSelectedId
		// const singleSelectedId = this._state.selected.singleSelectedId
		if (singleSelectedId && singleSelectedId === selectedId) {
			/*			this._entityStore.dispatch.setSelectedId(undefined)
			 this._state.updateState({
			 selected: {
			 singleSelectedId: undefined,
			 },
			 })*/
			this._machine.sendEvent(new ClearEntitySelected())
			return
		}

		const multipleSelectedIds = this._machine.ctx.selected.multipleSelectedIds
		// const multipleSelectedIds = this._state.selected.multipleSelectedIds
		if (multipleSelectedIds.includes(selectedId)) {
			this._machine.sendEvent(new AddEntitiesToMultipleSelected({ ids: multipleSelectedIds.filter(id => id !== selectedId) }))
			return
		}

		if (!selectedId) return

		const selectedEntity = this._state.entities.canvasEntities.getEntityById(selectedId)
		assertNotNull(selectedEntity, 'selected entity not found')
		this._machine.sendEvent(new AddEntitiesToMultipleSelected({ ids: [...multipleSelectedIds, selectedId] }))
	}

	removeFromMultiSelected(selected: CanvasEntity) {
		this._machine.sendEvent(new RemoveEntitiesFromMultipleSelected({ ids: [selected.id] }))
	}

	checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
		const singleSelectedId = this._machine.ctx.selected.singleSelectedId
		// const singleSelectedId = this._state.selected.singleSelectedId
		if (!singleSelectedId || singleSelectedId !== clickedOnEntityId && !event.shiftKey) {
			// this.clearSelectedState()
			this.clearSingleSelected()
			// this._entityStore.dispatch.clearState()
		}
	}

	clearSingleSelected() {
		if (this._machine.ctx.selected.singleSelectedId) {
			this._machine.sendEvent(new ClearEntitySelected())
		}
		/*		if (this._state.selected.singleSelectedId) {
		 this._state.updateState({
		 selected: {
		 singleSelectedId: undefined,
		 },
		 })

		 /!*      canvasAppXStateService.send({
		 type:    'ClickElsewhere',
		 payload: null,
		 })*!/
		 }*/
		/*    if (this._selectedId) {
		 this._selectedId = undefined
		 this._entityStore.dispatch.setSelectedId(undefined)
		 console.log('clear selected')
		 // this.emitDraw()
		 return
		 }*/
	}

	clearSelectedState() {
		/*		this._state.updateState({
		 selected: {
		 singleSelectedId: undefined, multipleSelectedIds: [],
		 },
		 })*/
		this._machine.sendEvent(new CancelSelected())
		/*    if (this._selectedId || this._multiSelectedIds.length || this._selectedStringId) {
		 // this._selected = undefined
		 this._selectedId = undefined
		 // this._multiSelected = []
		 this._multiSelectedIds = []
		 this._selectedStringId = undefined
		 this._entityStore.dispatch.clearState()
		 console.log('clear selected')

		 // this.emitDraw()
		 return
		 }*/
	}
}

/*
 export const isNotNull = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined*/
