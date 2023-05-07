import { DesignCanvasDirective } from './design-canvas.directive'
import { MovePanelsToStringV2Component } from './dialogs/move-panels-to-string-v2/move-panels-to-string-v2.component'
import { DynamicDialogDirective } from './dynamic-dialog.directive'
import {
	CanvasGraphicsMenuComponent,
	KeyMapComponent,
	RightClickMenuComponent,
	StateValuesComponent,
} from './menus'
import { WindowComponent } from './windows'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	NgZone,
	OnInit,
	Renderer2,
	signal,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatDialog } from '@angular/material/dialog'
import { AppNgrxStateStoreV2Service, DialogsService, WindowsStore } from '@design-app/data-access'
import { DraggableWindow } from '@design-app/shared'
import { LetModule } from '@ngrx/component'
import { getGuid } from '@ngrx/data'
import { ButtonBuilderComponent, ShowSvgComponent } from '@shared/ui'
import { updateObjectForStore } from 'deprecated/design-app/feature-design-canvas'
import {
	MovePanelsToStringSideUiComponent,
	MovePanelsToStringSideUiV2Component,
	MovePanelsToStringSideUiV3Component,
	SideUiNavBarComponent,
} from './side-uis'
import { MovePanelsToStringSideUiV4Component } from './side-uis/move-panels-to-string-v4/move-panels-to-string-side-ui-v4.component'
import { MovePanelsToStringSideUiV5Component } from './side-uis/move-panels-to-string-v5/move-panels-to-string-side-ui-v5.component'
import { OverlayToolBarComponent } from './overlays'
import { AppSettingsDialogComponent } from './dialogs'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetModule,
		KeyMapComponent,
		CanvasGraphicsMenuComponent,
		StateValuesComponent,
		RightClickMenuComponent,
		DesignCanvasDirective,
		WindowComponent,
		ButtonBuilderComponent,
		DesignCanvasDirective,
		DynamicDialogDirective,
		MovePanelsToStringV2Component,
		MovePanelsToStringSideUiComponent,
		MovePanelsToStringSideUiV2Component,
		MovePanelsToStringSideUiV3Component,
		MovePanelsToStringSideUiV4Component,
		MovePanelsToStringSideUiV5Component,
		SideUiNavBarComponent,
		OverlayToolBarComponent,
		AppSettingsDialogComponent,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit, AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _elementRef = inject(ElementRef)
	private _windows = inject(WindowsStore)
	private _matDialog = inject(MatDialog)
	private _dialogs = inject(DialogsService)
	private _appStore = inject(AppNgrxStateStoreV2Service)
	dialog$ = this._appStore.dialog$
	allDialogs$ = this._appStore.allDialogs$
	firstName = signal('Jane')
	lastName = signal('Doe')
	fullName = computed(() => `${this.firstName()} ${this.lastName()}`)
	windows$ = this._windows.select.allWindows$
	openWindows$ = this._windows.select.openWindows$
	openWindows = toSignal(this._windows.select.openWindows$)
	closedWindows$ = this._windows.select.closedWindows$
	@ViewChild('window', { static: true }) stringWindow!: WindowComponent
	isDragging = false

	windows: DraggableWindow[] = [
		{
			id: getGuid(),
			title: 'Window 1',
			location: { x: 100, y: 100 },
			size: { width: 200, height: 200 },
			isOpen: true,
		},
	]

	constructor() {
		effect(() => console.log('Name changed:', this.fullName()))
	}

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
		/*		this._dialogs.open(ViewStringComponent, {
		 string: {
		 id: getGuid(),
		 name: 'string',
		 color: 'red',
		 parallel: false,
		 } as CanvasString,
		 })*/
	}

	setName(newName: string) {
		this.firstName.set(newName)
	}

	ngAfterViewInit(): void {
		console.log(this.constructor.name, 'ngAfterViewInit')
		console.log(this.stringWindow, 'stringWindow')

		this._ngZone.runOutsideAngular(() => {
			// console.log('ngAfterViewInit', this.stringWindow.windowBar.nativeElement)
			/*	this._renderer.listen(
			 this.stringWindow.windowBar.nativeElement,
			 EVENT_TYPE.POINTER_DOWN,
			 (event: PointerEvent) => {
			 console.log('dragging', event)
			 this.isDragging = true
			 // if (this.isDragging) {
			 console.log('dragging', event)
			 this._renderer.setStyle(this.stringWindow.windowBar.nativeElement, 'top', `0px`)
			 this._renderer.setStyle(this.stringWindow.windowBar.nativeElement, 'left', `0px`)
			 // }
			 },
			 )
			 this._renderer.listen(
			 this.stringWindow.windowBar.nativeElement,
			 EVENT_TYPE.POINTER_UP,
			 (event: PointerEvent) => {
			 console.log('dragging', event)
			 this.isDragging = false
			 },
			 )

			 this._renderer.listen(
			 this.stringWindow.windowBar.nativeElement,
			 EVENT_TYPE.POINTER_MOVE,
			 (event: PointerEvent) => {
			 /!*			if (this.isDragging) {
			 console.log('dragging', event)
			 this._renderer.setStyle(this._elementRef.nativeElement, 'top', `${event.clientY}px`)
			 this._renderer.setStyle(this._elementRef.nativeElement, 'left', `${event.clientX}px`)
			 }*!/
			 },
			 )
			 /!*const svg = this._elementRef.nativeElement.querySelector('svg')
			 this._renderer.setStyle(svg, 'background-color', 'red')*!/*/
		})
	}

	pushWindow(event: MouseEvent) {
		this._windows.dispatch.addWindow({
			id: getGuid(),
			title: 'Window 2',
			location: { x: event.clientX, y: event.clientY },
			size: { width: 200, height: 200 },
			isOpen: true,
		})
		/*		this.windows.push({
		 id: 'window2',
		 title: 'Window 2',
		 location: { x: event.clientX, y: event.clientY },
		 size: { width: 200, height: 200 },
		 isOpen: true,
		 })*/
	}

	openWindow(window: DraggableWindow) {
		const update = updateObjectForStore(window, { isOpen: true })
		this._windows.dispatch.updateWindow(update)
	}

	closeWindow(window: DraggableWindow) {
		this._windows.dispatch.deleteWindow(window.id)
	}
}
