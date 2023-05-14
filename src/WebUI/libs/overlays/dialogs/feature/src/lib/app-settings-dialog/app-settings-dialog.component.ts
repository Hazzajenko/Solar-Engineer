import { AsyncPipe, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	signal,
	ViewChild,
	ViewChildren,
} from '@angular/core'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { ShowSvgComponent, ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import {
	DisplaySettingsComponent,
	GraphicsSettingsComponent,
	KeyMapSettingsComponent,
} from './index'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { heightInOut } from '@shared/animations'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { IsTypeOfPanelPipe } from '@entities/utils'

@Component({
	selector: 'dialog-app-settings',
	templateUrl: 'app-settings-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
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
		NgTemplateOutlet,
		ToggleSvgNoStylesComponent,
		KeyMapSettingsComponent,
		DisplaySettingsComponent,
	],
	animations: [heightInOut],
})
export class AppSettingsDialogComponent implements AfterViewInit {
	private _uiStore = inject(UiStoreService)
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>
	@ViewChildren('accordion') accordions!: ElementRef<HTMLDivElement>[]

	openedAccordions = signal(new Map<string, boolean>())

	/*	sections: {
	 // name: string
	 label: string
	 component: DynamicComponentType
	 }[] = [
	 {
	 // name: 'keyMapContext',
	 label: 'Key Map',
	 component: 'app-key-map-settings',
	 },
	 {
	 // name: 'graphicsContext',
	 label: 'Graphics',
	 component: 'app-canvas-graphics-settings',
	 },
	 ]*/

	ngAfterViewInit() {
		if (this.accordions) {
			console.log('accordions', this.accordions)
			this.accordions.forEach((accordion) => {
				this.openedAccordions.mutate((value) => value.set(accordion.nativeElement.id, true))
			})
		}
	}

	/*

	 sectionsV2: {
	 name: string
	 label: string
	 component: ComponentType<any>
	 }[] = [
	 {
	 name: 'keyMapContext',
	 label: 'Key Map',
	 component: KeyMapSettingsComponent,
	 },
	 {
	 name: 'graphicsContext',
	 label: 'Graphics',
	 component: GraphicsSettingsComponent,
	 },
	 ]
	 */

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
