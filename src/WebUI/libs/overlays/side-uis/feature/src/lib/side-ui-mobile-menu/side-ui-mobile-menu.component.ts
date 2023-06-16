import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Injector,
	signal,
	Signal,
} from '@angular/core'
import { injectAuthStore } from '@auth/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { NgClass, NgComponentOutlet, NgIf, NgOptimizedImage, NgStyle } from '@angular/common'
import { SideUiMobileMenuDirective } from './side-ui-mobile-menu.directive'
import { InputSvgComponent, ShowSvgComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { SideUiAuthViewComponent } from '../side-ui-auth-view/side-ui-auth-view.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
	SideUiNavBarViewComponent,
} from '../side-ui-nav-bar/side-ui-nav-bar.component'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { SideUiProjectsViewComponent } from '../side-ui-projects-view'
import { SideUiDataViewComponent } from '../side-ui-data-view/side-ui-data-view.component'
import { SideUiUsersViewComponent } from '../side-ui-users-view/side-ui-users-view.component'
import { SideUiNotificationsViewComponent } from '../side-ui-notifications-view/side-ui-notifications-view.component'

@Component({
	selector: 'side-ui-mobile-menu',
	standalone: true,
	imports: [
		NgIf,
		SideUiMobileMenuDirective,
		NgOptimizedImage,
		InputSvgComponent,
		ShowSvgComponent,
		LetDirective,
		NgStyle,
		NgClass,
		NgComponentOutlet,
	],
	templateUrl: './side-ui-mobile-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiMobileMenuComponent {
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	private _notificationsStore = injectNotificationsStore()
	private _injector = inject(Injector)
	loaded = false

	user = this._authStore.select.user
	sideUiMobileMenuOpen = this._uiStore.select.sideUiMobileMenuOpen as Signal<boolean>

	amountOfUnreadNotifications = computed(() => {
		if (!this._authStore.select.user()) return undefined
		return this._notificationsStore.select.amountOfUnreadNotifications()
	})
	currentView = signal<SideUiNavBarView>('none')
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

	constructor() {
		effect(() => {
			if (this.sideUiMobileMenuOpen() && !this.loaded) {
				this.loaded = true
				this.changeView('auth')
			}
		})
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
		this._uiStore.dispatch.toggleSideUiMobileMenu()
	}
}
