import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal } from '@angular/core'
import { injectAppUser } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { FilterProjectMembersByOnlinePipe } from '@entities/utils'
import { InputSvgComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { PluralizePipe, selectSignalFromStore } from '@shared/utils'
import { selectSelectedWebProject } from '../selectors/custom-projects.selectors'
import {
	ProjectDataViewComponent,
	ProjectDetailsViewComponent,
	ProjectMembersViewComponent,
	ProjectSettingsViewComponent,
} from '../shared'
import { SideUiBaseComponent } from '../../side-ui-base/side-ui-base.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../../side-ui-nav-bar/side-ui-nav-bar.component'
import { SELECTED_PROJECT_VIEW, SelectedProjectViewStore } from '../selected-project-view.store'
import { ProjectWebModel } from '@entities/shared'

@Component({
	selector: 'side-ui-selected-project-view',
	standalone: true,
	imports: [
		FilterProjectMembersByOnlinePipe,
		InputSvgComponent,
		LetDirective,
		NgIf,
		PluralizePipe,
		ProjectDetailsViewComponent,
		NgStyle,
		SideUiBaseComponent,
		NgSwitch,
		NgSwitchCase,
		ProjectDataViewComponent,
		ProjectMembersViewComponent,
		ProjectSettingsViewComponent,
	],
	templateUrl: './side-ui-selected-project-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiSelectedProjectViewComponent implements OnInit {
	private _selectedProjectViewStore = inject(SelectedProjectViewStore)
	private _projectStore = injectProjectsStore()
	private _uiStore = injectUiStore()
	selectedProject = selectSignalFromStore(selectSelectedWebProject) as Signal<ProjectWebModel>
	user = injectAppUser()
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
	currentProjectView = this._selectedProjectViewStore.selectedProjectView
	protected readonly SELECTED_PROJECT_VIEW = SELECTED_PROJECT_VIEW

	ngOnInit() {
		console.log('SideUiSelectedProjectViewComponent.ngOnInit()', this.currentProjectView())
		/*
		 if (this.currentProjectView() === SELECTED_PROJECT_VIEW.NONE) {
		 this._selectedProjectViewStore.enableCachedSelectedProjectView()
		 }*/
	}

	openProjectSelectorDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SELECT_PROJECT,
		})
	}
}
