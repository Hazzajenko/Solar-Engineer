import { Component, computed, inject, InjectionToken, Injector, signal } from '@angular/core'
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
	SideUiDataViewComponent,
	SideUiProjectsListViewComponent,
	SideUiSelectedProjectViewComponent,
} from '../projects'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { SideUiAuthViewComponent } from '../side-ui-auth-view/side-ui-auth-view.component'
import { SideUiUsersViewComponent } from '../side-ui-users-view/side-ui-users-view.component'
import { SideUiNotificationsViewComponent } from '../side-ui-notifications-view/side-ui-notifications-view.component'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { injectAuthStore } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'
import { injectProjectsStore } from '@entities/data-access'
import { SideUiNavItemDirective } from './side-ui-nav-item.directive'

export type SideUiNavBarView =
	| 'auth'
	| 'projects'
	| 'data'
	| 'users'
	| 'notifications'
	| 'selected-project'
	| 'none'
export type SideUiNavBarViewComponent =
	| typeof SideUiAuthViewComponent
	| typeof SideUiProjectsListViewComponent
	| typeof SideUiDataViewComponent
	| typeof SideUiUsersViewComponent
	| typeof SideUiNotificationsViewComponent
	| typeof SideUiSelectedProjectViewComponent
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
		SideUiDataViewComponent,
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
	private _uiStore = injectUiStore()
	private _notificationsStore = injectNotificationsStore()
	private _projectsStore = injectProjectsStore()
	private _injector = inject(Injector)
	private _selectedProjectViewStore = inject(SelectedProjectViewStore)
	private getCurrentViewComponent = (view: SideUiNavBarView) => {
		switch (view) {
			case 'auth':
				return SideUiAuthViewComponent
			case 'projects':
				return SideUiProjectsListViewComponent
			case 'data':
				return SideUiDataViewComponent
			case 'users':
				return SideUiUsersViewComponent
			case 'notifications':
				return SideUiNotificationsViewComponent
			case 'selected-project':
				return SideUiSelectedProjectViewComponent
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
	currentView = signal<SideUiNavBarView>('auth')

	/*	get currentProjectView(): SelectedProjectView {
	 return this._selectedProjectViewStore.selectedProjectView()
	 }*/
	currentViewComponent = signal<SideUiNavBarViewComponent>(SideUiAuthViewComponent)
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
		if (this._selectedProjectViewStore.selectedProjectView() === selectedProjectView) {
			this.changeView('selected-project')
			this._selectedProjectViewStore.setSelectedProjectView(selectedProjectView)
			return
		}
		this._selectedProjectViewStore.setSelectedProjectView(selectedProjectView)
		if (this.currentView() === 'selected-project') return
		this.changeView('selected-project')
	}

	changeView(view: SideUiNavBarView) {
		if (this.currentView() === view) {
			/*			if (view === 'selected-project') {
			 this._selectedProjectViewStore.setSelectedProjectView('none')
			 }*/
			this.currentView.set('none')
			this.currentViewComponent.set(null)
			return
		}

		/*		if (view !== 'selected-project' && this.currentView() === 'selected-project') {
		 this._selectedProjectViewStore.setSelectedProjectView('none')
		 }*/

		this.currentView.set(view)
		const viewComponent = this.getCurrentViewComponent(view)
		this.currentViewComponent.set(viewComponent)

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
}
