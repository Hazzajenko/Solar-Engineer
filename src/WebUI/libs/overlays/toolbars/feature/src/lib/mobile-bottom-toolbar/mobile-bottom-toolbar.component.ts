import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	QueryList,
	Renderer2,
	signal,
	ViewChild,
	ViewChildren,
} from '@angular/core'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { goTop, increaseTop } from '@shared/animations'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgStyle,
	NgSwitch,
	NgSwitchCase,
	NgTemplateOutlet,
} from '@angular/common'
import { ContextMenuDirective } from '@overlays/context-menus/feature'
import { Point } from '@shared/data-access/models'
import {
	ConsoleLogDirective,
	DivInitDirective,
	ExpandableAbsoluteDirective,
	ExpandDivWithElementsDirective,
} from '@shared/directives'
import { injectAppStateStore, ModeState } from '@canvas/app/data-access'
import { MobileBottomToolbarDirective } from './mobile-bottom-toolbar.directive'
import { StringColor, stringColors } from '@entities/shared'
import { UiStoreService } from '@overlays/ui-store/data-access'

@Component({
	selector: 'overlay-mobile-bottom-toolbar',
	standalone: true,
	imports: [
		ShowSvgNoStylesComponent,
		MatMenuModule,
		NgIf,
		ContextMenuDirective,
		DivInitDirective,
		NgClass,
		NgStyle,
		ConsoleLogDirective,
		ExpandableAbsoluteDirective,
		NgSwitch,
		NgSwitchCase,
		NgTemplateOutlet,
		ExpandDivWithElementsDirective,
		MobileBottomToolbarDirective,
		NgForOf,
	],
	templateUrl: './mobile-bottom-toolbar.component.html',
	styles: [],
	animations: [goTop, increaseTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomToolbarComponent {
	private _uiStore = inject(UiStoreService)
	private _appStore = injectAppStateStore()
	@ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger
	@ViewChildren('contextMenu') contextMenus!: QueryList<ElementRef<HTMLDivElement>>
	@ViewChild('mobileToolbar') mobileToolbarRef!: ElementRef<HTMLDivElement>
	menuTopLeftPosition = { x: '0', y: '0' }
	contextMenuLocation = { x: 0, y: 0 } as Point
	_renderer = inject(Renderer2)
	contextMenuOpen = signal<string | undefined>(undefined)
	currentContextMenuDiv = signal<ElementRef<HTMLDivElement> | undefined>(undefined)

	stringColors = stringColors as StringColor[]
	selectedStringColor = this._appStore.stringColor
	mode = this._appStore.mode
	// selectedStringColor = signal<StringColor>(STRING_COLOR.ORANGE)
	killContextMenu: (() => void) | undefined = undefined

	/*	constructor() {
	 effect(
	 () => {
	 this.selectedStringColor()
	 this._appStore.setStringColor(this.selectedStringColor())
	 },
	 { allowSignalWrites: true },
	 )
	 }*/

	/*	get mode() {
	 return this._appStore.mode()
	 }*/

	// protected readonly setMode = setMode

	setStringColor(color: StringColor) {
		// this.selectedStringColor.set(color)
		this._appStore.setStringColor(color)
	}

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			component: 'AppSettingsDialogComponent',
		})
		// heroAcademicCapSolid
	}

	toggleContextMenu(event: TouchEvent, contextMenuId: string) {
		event.preventDefault()
		event.stopPropagation()

		const isOpen = this.contextMenuOpen() === contextMenuId
		if (isOpen) {
			this.setContextMenuToUndefined()
			return
		}
		if (this.contextMenuOpen()) {
			this.setContextMenuToUndefined()
			this.contextMenuOpen.set(contextMenuId)
			const menu = this.contextMenus.find((c) => c.nativeElement.id === contextMenuId)
			if (!menu) {
				setTimeout(() => this.reFetchMenu(contextMenuId), 100)
				return
			}
			return
		}
		this.contextMenuOpen.set(contextMenuId)

		const menu = this.contextMenus.find((c) => c.nativeElement.id === contextMenuId)
		if (!menu) {
			setTimeout(() => this.reFetchMenu(contextMenuId), 100)
			return
		}
		this.currentContextMenuDiv.set(menu)
		this.finishMenuFunction()
	}

	reFetchMenu(contextMenuId: string) {
		const menu = this.contextMenus.find((c) => c.nativeElement.id === contextMenuId)
		if (!menu) {
			this.reFetchMenu(contextMenuId)
			return
		}
		console.log('menu', menu)
		this.currentContextMenuDiv.set(menu)

		this.finishMenuFunction()
	}

	finishMenuFunction() {
		this.killContextMenu = this._renderer.listen(document, 'touchstart', (event: TouchEvent) => {
			const target = event.target as HTMLElement
			// console.log('target', target)
			const currentContextMenuDiv = this.currentContextMenuDiv()
			if (!currentContextMenuDiv) {
				this.setContextMenuToUndefined()
				return
			}
			if (!currentContextMenuDiv.nativeElement.contains(target)) {
				this.setContextMenuToUndefined()
			}
		})
	}

	setContextMenuToUndefined() {
		this.contextMenuOpen.set(undefined)
		this.currentContextMenuDiv.set(undefined)
		if (this.killContextMenu) this.killContextMenu()
	}

	initDiv(div: HTMLDivElement | HTMLUListElement) {
		const rect = div.getBoundingClientRect()
		let left = this.contextMenuLocation.x
		const screenOffset = window.innerWidth * 0.1
		if (left < 0) {
			left = screenOffset
		}
		if (left + rect.width > window.innerWidth) {
			left = window.innerWidth - rect.width - screenOffset
		}
		const toolbarRect = this.mobileToolbarRef.nativeElement.getBoundingClientRect()
		const width = toolbarRect.width
		const toolbarTop = toolbarRect.top
		const top = toolbarTop - rect.height
		console.log(`top: ${top} = ${toolbarTop} - ${rect.height}`)
		this._renderer.setStyle(div, 'left', left + 'px')
		this._renderer.setStyle(div, 'width', width + 'px')
		const container = this.contextMenus.find((c) => c.nativeElement.id === 'main-context-menu')
		if (container) {
			this._renderer.setStyle(div, 'width', width + 'px')
		}
	}

	selectMode(mode: ModeState) {
		this._appStore.setModeState(mode)
		// this.setContextMenuToUndefined()
	}
}
