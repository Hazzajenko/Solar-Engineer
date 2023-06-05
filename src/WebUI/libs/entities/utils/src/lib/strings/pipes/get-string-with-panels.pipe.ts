/*
 import { Pipe, PipeTransform } from '@angular/core'
 import { StringId, StringModel } from '@entities/shared'
 import { injectEntityStore } from '@entities/data-access'

 export type StringWithPanelIds = StringModel & {
 panelIds: string[]
 }

 @Pipe({
 name: 'getStringWithPanelIds',
 standalone: true,
 })
 export class GetStringWithPanelIdsPipe implements PipeTransform {
 private _entities = injectEntityStore()
 // private _panelsStore = injectPanelsFeature()
 // private _stringsStore = injectStringsFeature()

 // private _entities = injectEntityStore()

 transform(stringId: StringId): StringWithPanelIds | undefined {
 console.log('GetStringWithPanelIdsPipe.transform()', stringId)
 // const string = this._stringsStore.getById(stringId)
 const string = this._entities.strings.select.getById(stringId)
 if (!string) return
 // const panelIds = this._panelsStore.select.getByStringId(stringId).map((panel) => panel.id)
 const panelIds = this._entities.panels.select.getByStringId(stringId).map((panel) => panel.id)
 return {
 ...string,
 panelIds,
 }
 }
 }
 */
