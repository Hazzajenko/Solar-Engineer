import { AsyncPipe, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { IsTypeOfPanelPipe, UiStoreService } from '@design-app/data-access'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'

import { ShowSvgComponent, ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { GraphicsSettingsComponent } from './index'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe } from '@design-app/utils'
import { TruncatePipe } from '@shared/pipes'
import { NgInitDirective } from '../../directives/ng-on-init.directive'
import { CreateComponentDirective } from '../../directives/dynamic-component.directive'
import { heightInOut } from '@shared/animations'

// import { addToMap } from '@grid-layout/data-access'

@Component({
	selector: 'dialog-app-settings',
	templateUrl: 'app-settings-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		MatDialogModule,
		MatButtonModule,
		LetDirective,
		DialogBackdropTemplateComponent,
		GraphicsSettingsComponent,
		NgStyle,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		CdkDrag,
		CdkDragHandle,
		IsTypeOfPanelPipe,
		RadiansToDegreesPipe,
		TruncatePipe,
		NgInitDirective,
		NgTemplateOutlet,
		CreateComponentDirective,
		ToggleSvgNoStylesComponent,
	],
	animations: [heightInOut],
})
export class AppSettingsDialogComponent {
	private _uiStore = inject(UiStoreService)
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>

	openedAccordions = signal(new Map<string, boolean>())

	// openedAccordions = new Map<string, boolean>()
	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}

	toggleAccordionView(accordionName: string) {
		this.openedAccordions.mutate((value) => value.set(accordionName, !value.get(accordionName)))
	}

	addToMap(accordionName: string) {
		this.openedAccordions.mutate((value) => value.set(accordionName, true))
	}

	// protected readonly addToMap = addToMap
	// protected readonly addToMap = addToMap
	// protected readonly addToMap = addToMap
}
