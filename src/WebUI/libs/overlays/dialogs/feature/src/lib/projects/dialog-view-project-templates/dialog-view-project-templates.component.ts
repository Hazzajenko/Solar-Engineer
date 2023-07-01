import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle } from '@angular/common'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import {
	DIALOG_COMPONENT,
	DialogInputInitialVisitWithTemplates,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { injectProjectsStore, ProjectsLocalStorageService } from '@entities/data-access'
import { PROJECT_TEMPLATES, ProjectTemplatePreviewModel } from '@entities/shared'
import { TruncatePipe } from '@shared/pipes'
import { PluralizePipe } from '@shared/utils'
import { injectAppUser } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

@Component({
	selector: 'dialog-view-project-templates',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgForOf,
		NgClass,
		NgIf,
		TruncatePipe,
		PluralizePipe,
		NgStyle,
		NgOptimizedImage,
		LetDirective,
	],
	templateUrl: './dialog-view-project-templates.component.html',
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogViewProjectTemplatesComponent {
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	private _projectsLocalStorage = inject(ProjectsLocalStorageService)
	user = injectAppUser()
	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputInitialVisitWithTemplates

	templates = PROJECT_TEMPLATES

	selectedTemplateName = signal<ProjectTemplatePreviewModel['name'] | undefined>(undefined)
	selectedTemplate = computed(() =>
		this.templates.find((t) => t.name === this.selectedTemplateName()),
	)

	selectTemplate(template: ProjectTemplatePreviewModel) {
		this.selectedTemplateName.set(template.name)
	}

	onSubmit() {
		const selectedTemplate = this.selectedTemplate()
		if (!selectedTemplate) throw new Error('No template selected')
		const user = this.user()
		if (!user && this._projectsLocalStorage.isProjectExisting()) {
			this._uiStore.dispatch.openDialog({
				component: DIALOG_COMPONENT.WARNING_TEMPLATE,
				data: {
					title: 'Warning',
					message: `Are you sure you want to load the ${selectedTemplate.templateName} template? This will overwrite your current project as you are not signed in.`,
					buttonText: 'Load Template',
					buttonAction: () =>
						this._projects.dispatch.loadProjectTemplate(selectedTemplate.templateName),
				},
			})
			return
		}
		this._projects.dispatch.loadProjectTemplate(selectedTemplate.templateName)
		this._uiStore.dispatch.closeDialog()
	}
}
