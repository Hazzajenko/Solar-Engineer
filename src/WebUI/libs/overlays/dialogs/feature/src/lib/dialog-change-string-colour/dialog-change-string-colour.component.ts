import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { injectStringsStore } from '@entities/data-access'
import { DialogInputChangeStringColour, injectUiStore } from '@overlays/ui-store/data-access'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'
import { dialogInputInjectionToken } from '../dialog-renderer'
import { assertNotNull } from '@shared/utils'
import { InputSvgComponent } from '@shared/ui'

@Component({
	selector: 'dialog-change-string-colour',
	standalone: true,
	imports: [DialogBackdropTemplateComponent, NgIf, NgForOf, NgClass, NgStyle, InputSvgComponent],
	templateUrl: './dialog-change-string-colour.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogChangeStringColourComponent {
	private _stringsStore = injectStringsStore()
	private _uiStore = injectUiStore()

	currentDialog = this._uiStore.select.currentDialog

	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputChangeStringColour

	string = this._stringsStore.select.selectById(this.dialog.data.stringId)
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	changeStringColour(
		colour:
			| '#EF4444'
			| '#F97316'
			| '#EC4899'
			| '#6B7280'
			| '#10B981'
			| '#3B82F6'
			| '#F59E0B'
			| '#8B5CF6'
			| '#14B8A6'
			| '#6366F1',
	) {
		const string = this.string()
		assertNotNull(string)
		this._stringsStore.dispatch.updateString({
			id: string.id,
			changes: {
				colour,
			},
		})
		// this._projectsStore.dispatch.deleteProject(project.id)
		// console.log('deleteProject', project)
		// this._uiStore.dispatch.closeDialog()
	}

	saveStringColour() {}
}
