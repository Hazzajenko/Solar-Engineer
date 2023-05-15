import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	InjectionToken,
	Injector,
} from '@angular/core'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuInput,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgComponentOutlet, NgIf } from '@angular/common'
import { SinglePanelMenuComponent } from '../single-panel-menu/single-panel-menu.component'
import { MultiplePanelsMenuComponent } from '../multiple-panels-menu/multiple-panels-menu.component'
import { StringMenuComponent } from '../string-menu/string-menu.component'
import { PanelLinkMenuComponent } from '../panel-link-menu'

export const contextMenuInputInjectionToken = new InjectionToken<ContextMenuInput>('')
/*export const createInjectorFn = () => {
 const injector = inject(Injector);

 return (pokemon: FlattenPokemon) =>
 Injector.create({
 providers: [{ provide: POKEMON_TOKEN, useValue:pokemon }],
 parent: injector
 });
 }*/

/*export const createPokemonInjectorFn = () => {
 const injector = inject(Injector);

 return (pokemon: FlattenPokemon) =>
 Injector.create({
 providers: [{ provide: POKEMON_TOKEN, useValue:pokemon }],
 parent: injector
 });
 }*/

@Component({
	selector: 'app-context-menu-renderer',
	standalone: true,
	imports: [NgIf, NgComponentOutlet],
	template: `
		<ng-container
			*ngIf="contextMenu && contextMenu.currentContextMenu && contextMenu.contextMenuOpen"
		>
			<ng-container *ngIf="component && contextMenuInjector">
				<ng-container *ngComponentOutlet="component; injector: contextMenuInjector" />
			</ng-container>
		</ng-container>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuRendererComponent {
	private _uiStore = inject(UiStoreService)
	private _contextMenu = toSignal(this._uiStore.contextMenu$, {
		initialValue: this._uiStore.contextMenu,
	})
	private _injector = inject(Injector)
	contextMenuInjector: Injector | undefined

	component: ReturnType<typeof this.switchFn> | undefined

	constructor() {
		effect(() => {
			if (
				!this.contextMenu ||
				!this.contextMenu.currentContextMenu ||
				!this.contextMenu.contextMenuOpen
			) {
				return
			}

			this.component = this.switchFn(this.contextMenu.currentContextMenu)

			this.contextMenuInjector = Injector.create({
				providers: [
					{
						provide: contextMenuInputInjectionToken,
						useValue: this.contextMenu.currentContextMenu,
					},
				],
				parent: this._injector,
			})
		})
	}

	get contextMenu() {
		return this._contextMenu()
	}

	private switchFn(contextMenu: ContextMenuInput) {
		switch (contextMenu.component) {
			case CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU:
				return SinglePanelMenuComponent
			case CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU:
				return MultiplePanelsMenuComponent
			case CONTEXT_MENU_COMPONENT.STRING_MENU:
				return StringMenuComponent
			case CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU:
				return PanelLinkMenuComponent
			default:
				throw new Error('Unknown context menu component')
		}
	}
}
