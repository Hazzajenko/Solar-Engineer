import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIf } from '@angular/common'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'

@Component({
	selector: 'app-empty-project-state',
	standalone: true,
	imports: [NgIf],
	templateUrl: './empty-project-state.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyProjectStateComponent {
	private _uiStore = injectUiStore()

	openCreateProjectDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CREATE_PROJECT,
		})
	}
}
