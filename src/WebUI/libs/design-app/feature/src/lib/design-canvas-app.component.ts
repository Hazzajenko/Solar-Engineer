import { DesignCanvasDirective } from './design-canvas.directive'
import { DynamicDialogDirective } from './dynamic-dialog.directive'
import { KeyMapComponent, RightClickMenuComponent, StateValuesComponent } from './menus'
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
import { AppStateStoreService, UiStoreService, WindowsStore } from '@design-app/data-access'
import { DraggableWindow } from '@design-app/shared'
import { LetDirective } from '@ngrx/component'
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
import { NgIfDirective } from './two-ngs.directive'
import { DynamicContextMenuDirective } from './dynamic-context-menu.directive'
import { AppSettingsDialogComponent } from './dialogs/app-settings-dialog/app-settings-dialog.component'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetDirective,
		KeyMapComponent,
		StateValuesComponent,
		RightClickMenuComponent,
		DesignCanvasDirective,
		WindowComponent,
		ButtonBuilderComponent,
		DesignCanvasDirective,
		DynamicDialogDirective,
		MovePanelsToStringSideUiComponent,
		MovePanelsToStringSideUiV2Component,
		MovePanelsToStringSideUiV3Component,
		MovePanelsToStringSideUiV4Component,
		MovePanelsToStringSideUiV5Component,
		SideUiNavBarComponent,
		OverlayToolBarComponent,
		AppSettingsDialogComponent,
		NgIfDirective,
		DynamicContextMenuDirective,
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
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	// dialog$ = this._dialogsStore.dialog$
	dialog$ = this._uiStore.dialog$
	private _dialog = toSignal(this._uiStore.dialog$, { initialValue: this._uiStore.dialog })
	private _contextMenu = toSignal(this._uiStore.contextMenu$, {
		initialValue: this._uiStore.contextMenu,
	})
	// dialog = this._uiStore.dialog
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

	get dialog() {
		return this._dialog()
	}

	get contextMenu() {
		return this._contextMenu()
	}

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
