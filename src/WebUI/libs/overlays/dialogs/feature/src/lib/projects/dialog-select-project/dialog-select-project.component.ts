import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { DialogInputInviteToProjectConfirm, injectUiStore } from '@overlays/ui-store/data-access'
import { selectSignalFromStore } from '@shared/utils'
import {
	ProjectCurrentlySelectedComponent,
	ProjectListItemComponent,
} from '@overlays/side-uis/feature'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf } from '@angular/common'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LetDirective } from '@ngrx/component'
import { ProjectWebModel } from '@entities/shared'
import { injectProjectsStore } from '@entities/data-access'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import { selectAllWebProjectsExceptSelected } from './select-all-web-projects-except-selected.selector'
import { TruncatePipe } from '@shared/pipes'

@Component({
	selector: 'dialog-select-project',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgIf,
		ReactiveFormsModule,
		LetDirective,
		NgForOf,
		ProjectListItemComponent,
		FormsModule,
		NgClass,
		ProjectCurrentlySelectedComponent,
		TruncatePipe,
	],
	templateUrl: './dialog-select-project.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSelectProjectComponent {
	private _fb = inject(FormBuilder)
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	currentDialog = this._uiStore.select.currentDialog
	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputInviteToProjectConfirm
	allWebProjects = selectSignalFromStore(selectAllWebProjectsExceptSelected)
	// allWebProjects = selectSignalFromStore(selectAllWebProjects)
	currentProjectId = this._projects.select.selectedProjectId
	// selectProjectForm = this._fb.group({
	// 	projectId: ['', [Validators.required]],
	// })
	selectedProjectId = signal<ProjectWebModel['id'] | undefined>(undefined)
	selectedProjectName = computed(() => {
		return this.allWebProjects().find((project) => project.id === this.selectedProjectId())?.name
	})

	onSubmit() {
		// if (!this.selectProjectForm.valid) {
		// 	console.error('Form is invalid', this.selectProjectForm)
		// 	return
		// }
		// console.log('Form is valid', this.selectProjectForm)
	}

	chooseProject(project: ProjectWebModel) {
		this.selectedProjectId.set(project.id)
	}

	selectProject() {
		const selectedProjectId = this.selectedProjectId()
		if (!selectedProjectId) {
			throw new Error('No project selected')
		}

		this._projects.dispatch.selectProject(selectedProjectId)
		this._uiStore.dispatch.closeDialog()
	}
}
