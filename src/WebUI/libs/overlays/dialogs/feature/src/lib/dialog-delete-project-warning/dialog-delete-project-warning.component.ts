import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { increaseScaleAndOpacity } from '@shared/animations'
import { DialogInputDeleteProjectWarning, injectUiStore } from '@overlays/ui-store/data-access'
import { dialogInputInjectionToken } from '../dialog-renderer'
import { injectProjectsStore } from '@entities/data-access'
import { NgIf } from '@angular/common'
import { ProjectModel } from '@entities/shared'

@Component({
	selector: 'dialog-delete-project-warning',
	standalone: true,
	imports: [DialogBackdropTemplateComponent, NgIf],
	templateUrl: './dialog-delete-project-warning.component.html',
	styles: [],
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDeleteProjectWarningComponent {
	private _projectsStore = injectProjectsStore()
	private _uiStore = injectUiStore()

	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputDeleteProjectWarning

	project = this._projectsStore.select.selectById(this.dialog.data.projectId)

	deleteProject(project: ProjectModel) {
		this._projectsStore.dispatch.deleteProject(project.id)
		console.log('deleteProject', project)
		this._uiStore.dispatch.closeDialog()
	}
}
