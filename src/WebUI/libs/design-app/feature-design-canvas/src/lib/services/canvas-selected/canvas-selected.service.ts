/*
 import { inject, Injectable } from '@angular/core'
 import { CanvasEntity, CanvasString, isPanel, UndefinedStringId } from '../../types'
 import { assertNotNull, isNotNull, mapToObject } from '@shared/utils'
 // import { CanvasEntitiesStore } from './canvas-entities'
 import { CanvasAppStateStore } from '../canvas-app-state'
 import { InjectClientState, SelectedSingleEntity, sendStateEvent } from '../canvas-client-state'


 @Injectable({
 providedIn: 'root',
 })
 export class CanvasSelectedService {
 private _entityStore = inject(CanvasAppStateStore)
 private _state = InjectClientState()

 handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: CanvasEntity) {
 if (event.shiftKey) {
 this.addToMultiSelected(entityUnderMouse.id)
 return
 }
 this.setSelected(entityUnderMouse.id)
 return
 }

 handleEntityDoubleClick(event: MouseEvent, entityUnderMouse: CanvasEntity, strings: CanvasString[]) {
 if (!isPanel(entityUnderMouse)) {
 this.setSelectedStringId(undefined)
 this._state.updateState({
 selected: {
 selectedStringId: undefined,
 },
 })
 console.log('implement double click for non panel')
 return
 }
 if (entityUnderMouse.stringId === UndefinedStringId) {
 console.log('implement double click for undefined string')
 return
 }

 const belongsToString = strings.find(string => string.id === entityUnderMouse.stringId)
 assertNotNull(belongsToString, 'string not found')
 this.setSelectedStringId(belongsToString.id)
 this._state.updateState({
 selected: {
 selectedStringId: belongsToString.id,
 },
 })
 return
 }

 setSelected(selectedId: string) {
 this._state.updateState({
 selected: {
 singleSelectedId: selectedId,
 },
 })
 sendStateEvent(new SelectedSingleEntity({ id: selectedId }))
 console.log('set selected', selectedId)
 }

 setSelectedStringId(id: CanvasString['id'] | undefined) {
 this._state.updateState({
 selected: {
 selectedStringId: id,
 },
 })
 console.log('set selected string id', id)
 }

 setMultiSelected(multiSelectedIds: string[]) {
 // this._multiSelected = multiSelected
 const multiSelected = mapToObject(multiSelectedIds.map(id => this._state.entities.canvasEntities.getEntityById(id))
 .filter(isNotNull))
 // const multiSelected = mapToObject(multiSelectedIds.map(id => this._entitiesStore.select.entityById(id)))
 // this._multiSelectedIds = multiSelectedIds
 this._entityStore.dispatch.setSelectedIds(multiSelectedIds)
 this._state.updateState({
 selected: {
 multipleSelectedIds: multiSelectedIds,
 },
 })
 console.log('set multiSelected', multiSelectedIds)
 }

 addToMultiSelected(selectedId: string) {
 const singleSelectedId = this._state.selected.singleSelectedId
 if (singleSelectedId && singleSelectedId === selectedId) {
 this._entityStore.dispatch.setSelectedId(undefined)
 this._state.updateState({
 selected: {
 singleSelectedId: undefined,
 },
 })
 return
 }

 const multipleSelectedIds = this._state.selected.multipleSelectedIds
 if (multipleSelectedIds.includes(selectedId)) {
 this._state.updateState({
 selected: {
 multipleSelectedIds: multipleSelectedIds.filter(id => id !== selectedId),
 },
 })
 return
 }

 if (!selectedId) return

 const selectedEntity = this._state.entities.canvasEntities.getEntityById(selectedId)
 assertNotNull(selectedEntity, 'selected entity not found')
 this._state.updateState({
 selected: {
 multipleSelectedIds: [...multipleSelectedIds, selectedId],
 },
 })
 }

 removeFromMultiSelected(selected: CanvasEntity) {
 /!*    const index = this._multiSelected.indexOf(selected)
 if (index > -1) {
 this._multiSelected.splice(index, 1)
 }
 console.log('remove from multiSelected', selected)
 this._entityStore.dispatch.removeFromSelectedIds([selected.id])*!/
 // this._state.selected.
 this._state.updateState({
 selected: {
 // ids:      this._state.selected.ids.filter(id => id !== selected.id),
 multipleSelectedIds: this._state.selected.multipleSelectedIds.filter(id => id !== selected.id), // entities: omit(this._state.selected.entities, selected.id),
 },
 })
 }

 checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
 /!*    if (this.selected?.id !== clickedOnEntityId && !event.shiftKey) {
 this.clearSingleSelected()

 }*!/
 const singleSelectedId = this._state.selected.singleSelectedId
 if (!singleSelectedId || singleSelectedId !== clickedOnEntityId && !event.shiftKey) {
 // this.clearSelectedState()
 this.clearSingleSelected()
 // this._entityStore.dispatch.clearState()
 }
 }

 clearSingleSelected() {
 if (this._state.selected.singleSelectedId) {
 this._state.updateState({
 selected: {
 singleSelectedId: undefined,
 },
 })
 /!*      canvasAppXStateService.send({
 type:    'ClickElsewhere',
 payload: null,
 })*!/
 }
 /!*    if (this._selectedId) {
 this._selectedId = undefined
 this._entityStore.dispatch.setSelectedId(undefined)
 console.log('clear selected')
 // this.emitDraw()
 return
 }*!/
 }

 clearSelectedState() {
 this._state.updateState({
 selected: {
 singleSelectedId: undefined, multipleSelectedIds: [],
 },
 })
 /!*    if (this._selectedId || this._multiSelectedIds.length || this._selectedStringId) {
 // this._selected = undefined
 this._selectedId = undefined
 // this._multiSelected = []
 this._multiSelectedIds = []
 this._selectedStringId = undefined
 this._entityStore.dispatch.clearState()
 console.log('clear selected')

 // this.emitDraw()
 return
 }*!/
 }
 }*/
