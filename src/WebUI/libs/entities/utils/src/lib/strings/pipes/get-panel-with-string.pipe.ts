/*
 import { inject, Pipe, PipeTransform } from '@angular/core'
 import { RenderService } from '@canvas/rendering/data-access'
 import { UiStoreService } from '@overlays/ui-store/data-access'
 import {
 ContextMenuType,
 isSingleEntityContextMenuTemplate,
 } from '@canvas/view-positioning/data-access'
 import { isPanel } from '../../panels'
 import { EntityBase, PanelId, StringModel } from '@entities/shared'
 import { injectEntityStore } from '@entities/data-access'

 export type PanelWithString = EntityBase & {
 string: StringModel | undefined
 }

 @Pipe({
 name: 'getPanelWithString',
 standalone: true,
 })
 export class GetPanelWithStringPipe implements PipeTransform {
 private _entities = injectEntityStore()
 // private _entities = injectEntityStore()
 private _render = inject(RenderService)
 // private _appStore = inject(AppStateStoreService)
 private _uiStore = inject(UiStoreService)

 // private _entities = injectEntityStore()

 transform(menu: ContextMenuType | undefined) {
 // transform(menu: ContextMenuType | undefined): PanelWithString | undefined {
 if (!menu) return
 if (!isSingleEntityContextMenuTemplate(menu)) return
 const entity = this._entities.panels.select.getById(menu.id as PanelId)
 if (!entity) return
 if (!isPanel(entity)) return
 const string = this._entities.strings.select.getById(entity.stringId)
 return {
 ...entity,
 string,
 deletePanel: () => {
 this._entities.panels.dispatch.deletePanel(entity.id)
 // this._entities.panels.dispatch.deletePanel(entity.id)
 this._render.renderCanvasApp()
 this._uiStore.dispatch.closeContextMenu()
 // this._appStore.dispatch.setContextMenuState('NoContextMenu')
 return
 },
 }
 }
 }
 */
