import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { GetStringWithPanelIdsPipe } from '@entities/utils'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuStringMenu,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { StringModel } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { injectEntityStore } from '@entities/data-access'

@Component({
	selector: 'app-string-menu',
	standalone: true,
	imports: [
		GetStringWithPanelIdsPipe,
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
	],
	templateUrl: './string-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringMenuComponent implements OnInit {
	private _entityStore = injectEntityStore()
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	id = CONTEXT_MENU_COMPONENT.STRING_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuStringMenu

	string!: StringModel
	panelIds: string[] = []

	ngOnInit() {
		const string = this._entityStore.strings.select.getById(this.contextMenu.data.stringId)
		if (!string) {
			console.error('String not found')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		this.string = string
		this.panelIds = this._entityStore.panels.getByStringId(string.id).map((panel) => panel.id)
	}

	// menuPosition!: Point

	/*	@Input({ required: true }) set location(location: Point) {
	 if (!location) {
	 this._render.renderCanvasApp()
	 this._uiStore.dispatch.closeContextMenu()
	 console.error('no location')
	 return
	 }
	 this.menuPosition = location
	 }

	 @Input({ required: true }) set data(data: { stringId: string }) {
	 if (!data.stringId) {
	 this._render.renderCanvasApp()
	 this._uiStore.dispatch.closeContextMenu()
	 console.error('String id not found')
	 return
	 }
	 const string = this._entityStore.strings.select.getById(data.stringId)
	 if (!string) {
	 this._render.renderCanvasApp()
	 this._uiStore.dispatch.closeContextMenu()
	 console.error('String not found')
	 return
	 }
	 const panelIds = this._entityStore.panels.getByStringId(string.id).map((panel) => panel.id)
	 if (!panelIds.length) {
	 this._render.renderCanvasApp()
	 this._uiStore.dispatch.closeContextMenu()
	 console.error('String has no panels')
	 return
	 }
	 this.string = string
	 this.panelIds = panelIds
	 }*/
}
