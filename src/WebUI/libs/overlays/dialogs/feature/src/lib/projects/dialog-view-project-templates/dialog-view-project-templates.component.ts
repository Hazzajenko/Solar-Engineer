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
import { DialogInputInviteToProjectConfirm, injectUiStore } from '@overlays/ui-store/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { PROJECT_TEMPLATES, ProjectTemplatePreviewModel } from '@entities/shared'
import { TruncatePipe } from '@shared/pipes'
import { PluralizePipe } from '@shared/utils'

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
	],
	templateUrl: './dialog-view-project-templates.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogViewProjectTemplatesComponent {
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputInviteToProjectConfirm

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
		this._projects.dispatch.loadProjectTemplate(selectedTemplate.templateName)
		this._uiStore.dispatch.closeDialog()
	}
}
