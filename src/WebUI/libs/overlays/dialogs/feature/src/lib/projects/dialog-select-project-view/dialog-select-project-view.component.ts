import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { injectProjectsStore } from '@entities/data-access'
import { DialogInputSelectProjectView, injectUiStore } from '@overlays/ui-store/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf } from '@angular/common'
import { SelectedProjectViewStore } from '@overlays/side-uis/feature'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import { InputSvgComponent } from '@shared/ui'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'

@Component({
	selector: 'dialog-select-project-view',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgForOf,
		NgIf,
		NgClass,
		InputSvgComponent,
		MatButtonModule,
		MatRippleModule,
	],
	templateUrl: './dialog-select-project-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSelectProjectViewComponent {
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	private _selectedProjectViewStore = inject(SelectedProjectViewStore)
	currentDialog = this._uiStore.select.currentDialog
	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputSelectProjectView
	currentView = this.dialog.data.currentView
	currentProjectId = this._projects.select.selectedProjectId
	views = [
		{
			key: 'data',
			name: 'Data',
		},
		{
			key: 'members',
			name: 'Members',
		},
		{
			key: 'settings',
			name: 'Settings',
		},
	].filter((view) => view.key !== this.currentView)

	selectedViewKey = signal<(typeof this.views)[number]['key'] | undefined>(undefined)
	selectedViewName = computed(() => {
		return this.views.find((view) => view.key === this.selectedViewKey())?.name
	})

	chooseView(viewKey: (typeof this.views)[number]['key']) {
		// this.selectedViewKey.set(viewKey)
		/*	const selectedViewKey = this.selectedViewKey()
		 if (!selectedViewKey) {
		 throw new Error('No project selected')
		 }*/

		this._selectedProjectViewStore.setSelectedProjectView(
			viewKey as 'data' | 'members' | 'settings',
		)
		this._uiStore.dispatch.closeDialog()
	}

	selectView() {
		const selectedViewKey = this.selectedViewKey()
		if (!selectedViewKey) {
			throw new Error('No project selected')
		}

		this._selectedProjectViewStore.setSelectedProjectView(
			selectedViewKey as 'data' | 'members' | 'settings',
		)
		this._uiStore.dispatch.closeDialog()
	}
}
