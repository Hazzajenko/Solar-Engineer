import { Component, inject, InjectionToken, Injector, signal } from '@angular/core'
import {
	NgClass,
	NgComponentOutlet,
	NgIf,
	NgStyle,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { toSignal } from '@angular/core/rxjs-interop'
import { LogoComponent } from '@shared/ui/logo'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { SideUiDataViewComponent } from '../side-ui-data-view/side-ui-data-view.component'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { SideUiAuthViewComponent } from '../side-ui-auth-view/side-ui-auth-view.component'
import { SideUiProjectsViewComponent } from '../side-ui-projects-view'
import { SideUiUsersViewComponent } from '../side-ui-users-view/side-ui-users-view.component'

export type SideUiNavBarView = 'auth' | 'projects' | 'data' | 'users' | 'none'
export type SideUiNavBarViewComponent =
	| typeof SideUiAuthViewComponent
	| typeof SideUiProjectsViewComponent
	| typeof SideUiDataViewComponent
	| typeof SideUiUsersViewComponent
	| null

export const sideUiInjectionToken = new InjectionToken<unknown>('')

@Component({
	selector: 'side-ui-nav-bar',
	standalone: true,
	templateUrl: 'side-ui-nav-bar.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [
		NgIf,
		LogoComponent,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		SideUiDataViewComponent,
		SideUiAuthViewComponent,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		NgStyle,
		NgClass,
		NgComponentOutlet,
	],
	hostDirectives: [MouseOverRenderDirective],
})
export class SideUiNavBarComponent {
	private _uiStore = inject(UiStoreService)
	private _sideUiNavBarOpen = toSignal(this._uiStore.sideUiNav$, {
		initialValue: this._uiStore.sideUiNav,
	})
	private _injector = inject(Injector)

	private _dataView = signal(false)
	authView = signal(true)
	currentView = signal<SideUiNavBarView>('auth')
	currentViewComponent = signal<SideUiNavBarViewComponent>(SideUiAuthViewComponent)

	sideUiInjector: Injector = Injector.create({
		providers: [
			{
				provide: sideUiInjectionToken,
				useValue: this.currentViewComponent(),
			},
		],
		parent: this._injector,
	})

	// sideUiInjector: Injector | undefined

	get dataView() {
		return this._dataView()
	}

	get sideUiNavBarOpen() {
		return this._sideUiNavBarOpen()
	}

	changeView(view: SideUiNavBarView) {
		if (this.currentView() === view) {
			this.currentView.set('none')
			this.currentViewComponent.set(null)
			return
		}

		this.currentView.set(view)
		switch (view) {
			case 'auth':
				this.currentViewComponent.set(SideUiAuthViewComponent)
				break
			case 'projects':
				this.currentViewComponent.set(SideUiProjectsViewComponent)
				break
			case 'data':
				this.currentViewComponent.set(SideUiDataViewComponent)
				break
			case 'users':
				this.currentViewComponent.set(SideUiUsersViewComponent)
				break
			default:
				this.currentViewComponent.set(null)
		}

		this.sideUiInjector = Injector.create({
			providers: [
				{
					provide: sideUiInjectionToken,
					useValue: this.currentViewComponent(),
				},
			],
			parent: this._injector,
		})
	}

	toggle() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	toggleDataView() {
		this._dataView.mutate((dataView) => !dataView)
	}

	toggleAuthView() {
		this.authView.mutate((authView) => !authView)
	}
}
