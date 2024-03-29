import { Component, computed, inject, InjectionToken, Injector } from '@angular/core'
import {
	NgClass,
	NgComponentOutlet,
	NgIf,
	NgStyle,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
	SlicePipe,
} from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { LogoComponent } from '@shared/ui/logo'
import { InputSvgComponent, ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import {
	SelectedProjectView,
	SelectedProjectViewStore,
	SideUiDemoProjectViewComponent,
	SideUiProjectsListViewComponent,
	SideUiSelectedProjectViewComponent,
} from '../projects'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { SideUiAuthViewComponent } from '../side-ui-auth-view/side-ui-auth-view.component'
import { SideUiUsersViewComponent } from '../side-ui-users-view/side-ui-users-view.component'
import { SideUiNotificationsViewComponent } from '../side-ui-notifications-view/side-ui-notifications-view.component'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { injectAuthStore, injectUsersStore } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'
import { injectProjectsStore } from '@entities/data-access'
import { SideUiNavItemDirective } from './side-ui-nav-item.directive'
import { SideUiNavBarStore } from './side-ui-nav-bar.store'
import { SideUiSettingsViewComponent } from '../settings'

export type SideUiNavBarView =
	| 'auth'
	| 'projects'
	| 'users'
	| 'notifications'
	| 'selected-project'
	| 'demo-project'
	| 'settings'
	| 'none'
export type SideUiNavBarViewComponent =
	| typeof SideUiAuthViewComponent
	| typeof SideUiProjectsListViewComponent
	| typeof SideUiUsersViewComponent
	| typeof SideUiNotificationsViewComponent
	| typeof SideUiSelectedProjectViewComponent
	| typeof SideUiDemoProjectViewComponent
	| typeof SideUiSettingsViewComponent
	| null

export const sideUiInjectionToken = new InjectionToken<SideUiNavBarView>('CurrentView')

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
		SideUiAuthViewComponent,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		NgStyle,
		NgClass,
		NgComponentOutlet,
		LetDirective,
		InputSvgComponent,
		SlicePipe,
		SideUiNavItemDirective,
	],
	hostDirectives: [MouseOverRenderDirective],
})
export class SideUiNavBarComponent {
	private _authStore = injectAuthStore()
	private _usersStore = injectUsersStore()
	private _uiStore = injectUiStore()
	private _notificationsStore = injectNotificationsStore()
	private _projectsStore = injectProjectsStore()
	private _injector = inject(Injector)
	private _selectedProjectViewStore = inject(SelectedProjectViewStore)
	private _sideUiNavBarStore = inject(SideUiNavBarStore)
	private getCurrentViewComponent = (view: SideUiNavBarView) => {
		switch (view) {
			case 'auth':
				return SideUiAuthViewComponent
			case 'projects':
				return SideUiProjectsListViewComponent
			case 'users':
				return SideUiUsersViewComponent
			case 'notifications':
				return SideUiNotificationsViewComponent
			case 'selected-project':
				return SideUiSelectedProjectViewComponent
			case 'demo-project':
				return SideUiDemoProjectViewComponent
			case 'settings':
				return SideUiSettingsViewComponent
			default:
				return null
		}
	}
	projectView = this._selectedProjectViewStore.selectedProjectView
	user = this._authStore.select.user
	sideUiNavBarOpen = this._uiStore.select.sideUiNavOpen
	selectedProject = this._projectsStore.select.selectedProject
	amountOfUnreadNotifications = computed(() => {
		if (!this._authStore.select.user()) return undefined
		return this._notificationsStore.select.amountOfUnreadNotifications()
	})
	amountOfOnlineFriends = computed(() => {
		if (!this._authStore.select.user()) return undefined
		return this._usersStore.select.amountOfOnlineFriends()
	})
	currentView = this._sideUiNavBarStore.currentView
	// currentView = signal<SideUiNavBarView>('auth')

	currentViewComponent = computed(() => {
		return this.getCurrentViewComponent(this.currentView())
	})
	// currentViewComponent = signal<SideUiNavBarViewComponent>(SideUiAuthViewComponent)
	sideUiInjector: Injector = Injector.create({
		providers: [
			{
				provide: sideUiInjectionToken,
				useValue: this.currentView(),
			},
		],
		parent: this._injector,
	})
	setSelectedProjectView = (selectedProjectView: SelectedProjectView) => {
		if (this.currentView() !== 'selected-project') {
			this.changeView('selected-project')
			this._selectedProjectViewStore.setSelectedProjectView(selectedProjectView)
			return
		}
		if (this._selectedProjectViewStore.selectedProjectView() === selectedProjectView) {
			this.changeView('none')
			return
		}
		this._selectedProjectViewStore.setSelectedProjectView(selectedProjectView)
	}

	changeView(view: SideUiNavBarView) {
		const isGoingBackToProjectProfile =
			this.currentView() === 'selected-project' &&
			this._selectedProjectViewStore.selectedProjectView() !== 'profile' &&
			view === 'selected-project'

		if (isGoingBackToProjectProfile) {
			this._selectedProjectViewStore.setSelectedProjectView('profile')
			return
		}

		if (this.currentView() === view) {
			this._sideUiNavBarStore.changeView('none')
			// this._sideUiNavBarStore.changeView('none')

			// this.currentViewComponent.set(null)
			return
		}

		if (view === 'selected-project') {
			this._sideUiNavBarStore.changeView(view)
			// this.currentViewComponent.set(SideUiSelectedProjectViewComponent)
			this._selectedProjectViewStore.setSelectedProjectView('profile')
			this.sideUiInjector = Injector.create({
				providers: [
					{
						provide: sideUiInjectionToken,
						useValue: this.currentView(),
					},
				],
				parent: this._injector,
			})
			return
		}

		this._sideUiNavBarStore.changeView(view)
		// const viewComponent = this.getCurrentViewComponent(view)
		// this.currentViewComponent.set(viewComponent)

		this.sideUiInjector = Injector.create({
			providers: [
				{
					provide: sideUiInjectionToken,
					useValue: this.currentView(),
				},
			],
			parent: this._injector,
		})
	}

	toggle() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	openChat() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.MESSAGES,
		})
	}

	openSignInDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN,
		})
	}

	openTemplatesDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
		})
	}
}
