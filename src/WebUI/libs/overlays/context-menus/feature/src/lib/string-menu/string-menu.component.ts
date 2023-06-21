import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuStringMenu,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { StringModel } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { injectEntityStore } from '@entities/data-access'
import { ContextMenuBaseComponent, ContextMenuItemComponent } from '../context-menu-builder'

@Component({
	selector: 'app-string-menu',
	standalone: true,
	imports: [
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
		ContextMenuBaseComponent,
		ContextMenuItemComponent,
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
		this.panelIds = this._entityStore.panels.select
			.getByStringId(string.id)
			.map((panel) => panel.id)
	}

	editString() {
		console.log('edit string')
	}

	deleteString() {
		const string = this.string
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.WARNING_TEMPLATE,
			data: {
				title: 'Delete String',
				message: `Are you sure you want to delete string ${string.name}?`,
				buttonText: 'Delete',
				buttonAction: () => {
					this._entityStore.strings.dispatch.deleteString(string.id)
				},
			},
		})
		this._uiStore.dispatch.closeContextMenu()
	}
}
