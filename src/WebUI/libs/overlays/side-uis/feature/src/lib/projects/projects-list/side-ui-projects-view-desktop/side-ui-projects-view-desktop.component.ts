import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	Input,
	signal,
} from '@angular/core'
import { injectAuthStore } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { PluralizePipe } from '@shared/utils'
import { ProjectId, ProjectModel, ProjectWebModel } from '@entities/shared'

import { heightInOutWithConfig } from '@shared/animations'
import {
	AssertIsProjectPipe,
	FilterProjectMembersByOnlinePipe,
	GetProjectByIdPipe,
} from '@entities/utils'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'
import {
	ButtonAnimatedDownUpArrowComponent,
	ButtonContextMenuComponent,
	InputSvgComponent,
} from '@shared/ui'
import { SideUiBaseComponent } from '../../../side-ui-base/side-ui-base.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../../../side-ui-nav-bar/side-ui-nav-bar.component'
import { ProjectDetailsViewComponent, ProjectListItemComponent } from '../../shared'
import { MatTooltipModule } from '@angular/material/tooltip'
import { SideUiNavBarStore } from '../../../side-ui-nav-bar/side-ui-nav-bar.store'

@Component({
	selector: 'side-ui-projects-view-desktop',
	standalone: true,
	imports: [
		AssertIsProjectPipe,
		AuthWebUserAvatarComponent,
		DefaultHoverEffectsDirective,
		NgIf,
		TruncatePipe,
		LetDirective,
		NgForOf,
		NgStyle,
		FilterProjectMembersByOnlinePipe,
		PluralizePipe,
		ProjectDetailsViewComponent,
		InputSvgComponent,
		NgTemplateOutlet,
		SideUiBaseComponent,
		NgClass,
		GetProjectByIdPipe,
		TimeDifferenceFromNowPipe,
		ProjectListItemComponent,
		ButtonAnimatedDownUpArrowComponent,
		ButtonContextMenuComponent,
		MatTooltipModule,
	],
	templateUrl: './side-ui-projects-view-desktop.component.html',
	styles: [
		`
			/* width */
			::-webkit-scrollbar {
				width: 5px;
			}

			/* Track */
			::-webkit-scrollbar-track {
				background: #f1f1f1;
			}

			/* Handle */
			::-webkit-scrollbar-thumb {
				background: #888;
			}

			/* Handle on hover */
			::-webkit-scrollbar-thumb:hover {
				background: #555;
			}
		`,
	],
	animations: [heightInOutWithConfig(0.1)],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiProjectsViewDesktopComponent {
	private _auth = injectAuthStore()
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	private _sideUiNavBarStore = inject(SideUiNavBarStore)
	user = this._auth.select.user
	@Input({ required: true }) projects: ProjectWebModel[] = []
	// selectedProject = this._projects.select.selectedProject
	selectedProject = computed(() => {
		const id = this._projects.select.selectedProjectId()
		if (!id) return undefined
		return this.projects.find((p) => p.id === id)
	})
	openedProjectId = signal<ProjectId | undefined>(undefined)
	openedProject = computed(() => {
		const id = this.openedProjectId()
		if (!id) return undefined
		return this.projects.find((p) => p.id === id)
	})
	// openedProjects = signal<Map<ProjectId, boolean>>(new Map())

	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView

	vm = computed(() => {
		const projects = this.projects.sort(
			(a, b) => new Date(b.lastModifiedTime).getTime() - new Date(a.lastModifiedTime).getTime(),
		)
		return {
			projects,
			selectedProject: this.selectedProject(),
			openedProject: this.openedProject(),
		}
	})
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	selectProject(project: ProjectModel) {
		if (this.selectedProject()?.id === project.id) return
		this._projects.dispatch.selectProject(project.id)
		// this._sideUiNavBarStore.changeView('selected-project')
	}

	createProject() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CREATE_PROJECT,
		})
	}

	toggleProjectView(project: ProjectModel) {
		const id = project.id
		if (this.openedProjectId() === id) {
			this.openedProjectId.set(undefined)
			return
		}
		this.openedProjectId.set(id)
	}

	openProjectContextMenu(event: MouseEvent, project: ProjectModel) {
		this._uiStore.dispatch.openContextMenu({
			component: CONTEXT_MENU_COMPONENT.PROJECT_MENU,
			data: { projectId: project.id },
			location: { x: event.clientX, y: event.clientY },
		})
	}

	openSignInDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN,
		})
	}

	selectStringInApp(id: any) {}
}
