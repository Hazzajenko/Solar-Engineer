import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { increaseScaleAndOpacity } from '@shared/animations'
import { DialogInputDeleteProjectWarning } from '@overlays/ui-store/data-access'
import { dialogInputInjectionToken } from '../dialog-renderer'
import { injectProjectsStore } from '@entities/data-access'
import { NgIf } from '@angular/common'

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

	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputDeleteProjectWarning

	project = this._projectsStore.select.selectById(this.dialog.data.projectId)
}
