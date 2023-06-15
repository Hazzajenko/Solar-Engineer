import { Component, computed, inject, InjectionToken, Injector, signal } from '@angular/core'
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
import { LogoComponent } from '@shared/ui/logo'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { SideUiDataViewComponent } from '../side-ui-data-view/side-ui-data-view.component'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { SideUiAuthViewComponent } from '../side-ui-auth-view/side-ui-auth-view.component'
import { SideUiProjectsViewComponent } from '../side-ui-projects-view'
import { SideUiUsersViewComponent } from '../side-ui-users-view/side-ui-users-view.component'
import { SideUiNotificationsViewComponent } from '../side-ui-notifications-view/side-ui-notifications-view.component'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { injectAuthStore } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

export type SideUiNavBarView = 'auth' | 'projects' | 'data' | 'users' | 'notifications' | 'none'
export type SideUiNavBarViewComponent =
	| typeof SideUiAuthViewComponent
	| typeof SideUiProjectsViewComponent
	| typeof SideUiDataViewComponent
	| typeof SideUiUsersViewComponent
	| typeof SideUiNotificationsViewComponent
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
		LetDirective,
	],
	hostDirectives: [MouseOverRenderDirective],
})
export class SideUiNavBarComponent {
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	private _notificationsStore = injectNotificationsStore()
	private _injector = inject(Injector)

	sideUiNavBarOpen = this._uiStore.select.sideUiNavOpen

	amountOfUnreadNotifications = computed(() => {
		if (!this._authStore.select.user()) return undefined
		return this._notificationsStore.select.amountOfUnreadNotifications()
	})
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
			case 'notifications':
				this.currentViewComponent.set(SideUiNotificationsViewComponent)
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
}
