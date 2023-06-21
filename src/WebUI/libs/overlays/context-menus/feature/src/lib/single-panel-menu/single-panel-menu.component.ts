import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, signal } from '@angular/core'
import { JsonPipe, NgIf } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuSinglePanelMenu,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { PanelLinkModel, PanelModel, StringModel } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { LetDirective } from '@ngrx/component'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroMinusCircle } from '@ng-icons/heroicons/outline'
import { assertNotNull } from '@shared/utils'
import { injectEntityStore } from '@entities/data-access'
import { injectAppStateStore } from '@canvas/app/data-access'
import { scaleAndOpacityAnimation } from '@shared/animations'
import { ContextMenuBaseComponent, ContextMenuItemComponent } from '../context-menu-builder'

@Component({
	selector: 'app-single-panel-menu',
	standalone: true,
	imports: [
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
		JsonPipe,
		ShowSvgNoStylesComponent,
		LetDirective,
		NgIconComponent,
		ContextMenuBaseComponent,
		ContextMenuItemComponent,
	],
	providers: [provideIcons({ heroMinusCircle })],
	templateUrl: './single-panel-menu.component.html',
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	animations: [scaleAndOpacityAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePanelMenuComponent implements OnInit {
	private _entityStore = injectEntityStore()
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)
	private _appStore = injectAppStateStore()
	private _selectedStore = injectSelectedStore()

	id = CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuSinglePanelMenu

	panel!: PanelModel
	string: StringModel | undefined
	inLinkMode = signal(false)
	panelLinks = signal<{
		positiveToLink: PanelLinkModel | undefined
		positiveToPanel: PanelModel | undefined
		negativeToLink: PanelLinkModel | undefined
		negativeToPanel: PanelModel | undefined
	}>({
		positiveToLink: undefined,
		positiveToPanel: undefined,
		negativeToLink: undefined,
		negativeToPanel: undefined,
	})

	ngOnInit() {
		const panel = this._entityStore.panels.select.getById(this.contextMenu.data.panelId)
		if (!panel) {
			console.error('No panel')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		this.panel = panel
		this.string = this._entityStore.strings.select.selectById(panel.stringId)()

		const linkMode = this._appStore.select.mode() === 'LinkMode'
		const isInSelectedString = this._selectedStore.select.selectedStringId() === this.panel.stringId

		if (linkMode && isInSelectedString) {
			this.inLinkMode.set(true)
			const { positiveToLink, negativeToLink } =
				this._entityStore.panelLinks.select.getLinksMappedByPanelId(panel.id)
			const positiveToPanel = positiveToLink
				? this._entityStore.panels.select.getById(positiveToLink.negativePanelId)
				: undefined
			const negativeToPanel = negativeToLink
				? this._entityStore.panels.select.getById(negativeToLink.positivePanelId)
				: undefined
			this.panelLinks.set({
				positiveToLink,
				positiveToPanel,
				negativeToLink,
				negativeToPanel,
			})
		}
	}

	deletePanel() {
		this._entityStore.panels.dispatch.deletePanel(this.panel.id)
		this._uiStore.dispatch.closeContextMenu()
	}

	addPanelToString() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING,
			data: {
				panelIds: [this.panel.id],
			},
		})
	}

	enterPolarityLink(
		event: PointerEvent,
		polarityToLink: PanelLinkModel,
		polarityToPanel: PanelModel,
	) {
		event.stopPropagation()
		const polarity = polarityToLink.positivePanelId === polarityToPanel.id ? 'negative' : 'positive'
		this._entityStore.panelLinks.dispatch.setHoveringOverPanelLinkInLinkMenu({
			panelId: polarityToPanel.id,
			panelLinkId: polarityToLink.id,
			polarity,
		})
	}

	leavePolarityPanel(event: PointerEvent) {
		event.stopPropagation()
		this._entityStore.panelLinks.dispatch.clearHoveringOverPanelLinkInLinkMenu()
	}

	setPanelAsDisconnectionPoint() {
		assertNotNull(this.string)
		const update = {
			id: this.string.id,
			changes: {
				disconnectionPointId: this.panel.id,
			},
		}
		this._entityStore.strings.dispatch.updateString(update)
	}

	openStringEdit() {
		console.log('openStringEdit')
	}

	removePanelFromString() {
		this._entityStore.panels.dispatch.updatePanel({
			id: this.panel.id,
			changes: {
				stringId: undefined,
			},
		})
	}
}
