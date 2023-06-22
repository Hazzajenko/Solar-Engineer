import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Injector,
	signal,
} from '@angular/core'
import {
	AssertIsProjectPipe,
	FilterProjectMembersByOnlinePipe,
	GetProjectByIdPipe,
} from '@entities/utils'
import { AuthUsersPreviewComponent, AuthWebUserAvatarComponent } from '@auth/ui'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { ContextMenuModule } from 'primeng/contextmenu'
import { AccordionModule } from 'primeng/accordion'
import { LetDirective } from '@ngrx/component'
import { SideUiBaseComponent } from '../../../side-ui-base/side-ui-base.component'
import {
	getTimeDifferenceFromNow,
	pluralize,
	PluralizePipe,
	selectSignalFromStore,
} from '@shared/utils'
import {
	ProjectDetailsViewComponent,
	ProjectListItemComponent,
	ProjectProfileViewComponent,
} from '../../shared'
import {
	ANIMATION_EVENT,
	fadeInFadeOutWithConfig,
	inLeftLeaveLeftWithConfig,
	inLeftLeaveLeftWithConfigV2,
	inRightLeaveRightWithConfig,
} from '@shared/animations'
import { injectAuthStore } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { ProjectModel, ProjectWebModel } from '@entities/shared'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../../../side-ui-nav-bar/side-ui-nav-bar.component'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'
import { selectAllWebProjects } from '../../selectors/custom-projects.selectors'

@Component({
	selector: 'side-ui-projects-view-mobile',
	standalone: true,
	imports: [
		NgIf,
		NgForOf,
		NgClass,
		NgStyle,
		ShowSvgNoStylesComponent,
		NgTemplateOutlet,
		TruncatePipe,
		ContextMenuModule,
		AccordionModule,
		LetDirective,
		NgOptimizedImage,
		AuthWebUserAvatarComponent,
		SideUiBaseComponent,
		InputSvgComponent,
		DefaultHoverEffectsDirective,
		GetProjectByIdPipe,
		AuthUsersPreviewComponent,
		PluralizePipe,
		FilterProjectMembersByOnlinePipe,
		ProjectDetailsViewComponent,
		AssertIsProjectPipe,
		TimeDifferenceFromNowPipe,
		ProjectListItemComponent,
		ProjectProfileViewComponent,
	],
	templateUrl: './side-ui-projects-view-mobile.component.html',
	styles: [
		`
			:host {
				overflow-x: hidden;
				overflow-y: auto;
				scrollbar-width: none;
			}
		`,
	], // animations: [inLeftLeaveLeftWithConfig(4), inRightLeaveRightWithConfig(4)],
	animations: [
		inLeftLeaveLeftWithConfig(0.25),
		inRightLeaveRightWithConfig(0.25),
		inLeftLeaveLeftWithConfigV2(0.25),
		fadeInFadeOutWithConfig(0.1),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiProjectsViewMobileComponent {
	private _auth = injectAuthStore()
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	hideProjectsList = signal(false)
	showProjectView = signal(false)
	user = this._auth.select.user

	projects = selectSignalFromStore(selectAllWebProjects)
	// @Input({ required: true }) projects: ProjectWebModel[] = []
	selectedProject = this._projects.select.selectedProject
	// openedProjects = signal<Map<ProjectId, boolean>>(new Map())
	openedProjectId = signal<ProjectWebModel['id'] | undefined>(undefined)
	private _transitionAnimationEffect = effect((onCleanup) => {
		const timer = this.openedProjectId()
			? setTimeout(() => {
					this.hideProjectsList.set(true)
					this.showProjectView.set(true)
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }, 10)
			: setTimeout(() => {
					this.hideProjectsList.set(false)
					this.showProjectView.set(false)
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }, 10)

		onCleanup(() => {
			clearTimeout(timer)
		})
	})
	openedProject = computed(() => {
		const openedProjectId = this.openedProjectId()
		if (!openedProjectId) return undefined
		if (!this.showProjectView()) return undefined
		return this.projects().find((project) => project.id === openedProjectId)
	})
	routingToProjectView = signal(false)
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
	vm = computed(() => {
		const projects = this.projects().sort(
			(a, b) => new Date(b.lastModifiedTime).getTime() - new Date(a.lastModifiedTime).getTime(),
		)
		return {
			projects,
			selectedProject: this.selectedProject(),
			openedProjectId: this.openedProjectId(),
		}
	})
	protected readonly pluralize = pluralize
	protected readonly getTimeDifferenceFromNow = getTimeDifferenceFromNow
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	projectTrackByFn(index: number, item: ProjectWebModel) {
		return item.id || index
	}

	selectProject(project: ProjectModel) {
		if (this.selectedProject()?.id === project.id) return
		this._projects.dispatch.selectProject(project.id)
	}

	createProject() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CREATE_PROJECT,
		})
	}

	toggleProjectView(project: ProjectModel) {
		const id = project.id
		this.openedProjectId.set(id === this.openedProjectId() ? undefined : id)
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

	onHideProjectsListAnimationDone(event: unknown) {
		const animationEvent = ANIMATION_EVENT.safeParse(event)
		console.log(animationEvent)
		if (!animationEvent.success) return
		const data = animationEvent.data
		if (data.fromState === 'void') return
		this.routingToProjectView.set(true)
	}

	startRouteToProjectsList(event: unknown) {
		const animationEvent = ANIMATION_EVENT.safeParse(event)
		console.log(animationEvent)
		if (!animationEvent.success) return
		const data = animationEvent.data
		if (data.fromState === 'void') return
		this.routingToProjectView.set(false)
	}

	goBack() {
		this.openedProjectId.set(undefined)
	}
}
