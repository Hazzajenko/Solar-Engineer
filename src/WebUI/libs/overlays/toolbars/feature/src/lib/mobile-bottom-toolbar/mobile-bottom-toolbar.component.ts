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
import { goTop } from '@shared/animations'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { NgClass, NgIf } from '@angular/common'
import { ContextMenuDirective } from '@overlays/context-menus/feature'
import { Point } from '@shared/data-access/models'
import { DivInitDirective } from '@shared/directives'
import { injectAppStateStore, ModeState } from '@canvas/app/data-access'

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
	],
	templateUrl: './mobile-bottom-toolbar.component.html',
	styles: [],
	animations: [goTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomToolbarComponent {
	private _appStore = injectAppStateStore()
	@ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger
	@ViewChildren('contextMenu') contextMenu!: QueryList<ElementRef<HTMLDivElement>>
	// @ViewChild('contextMenu') contextMenu!: ElementRef<HTMLDivElement>
	@ViewChild('mobileToolbar') mobileToolbar!: ElementRef<HTMLDivElement>
	menuTopLeftPosition = { x: '0', y: '0' }
	contextMenuLocation = { x: 0, y: 0 } as Point
	_renderer = inject(Renderer2)
	_element = inject(ElementRef).nativeElement
	contextMenuOpen = signal<string | undefined>(undefined)

	get mode() {
		return this._appStore.mode()
	}

	// contextMenuOpen = signal(false)

	toggleContextMenu(event: TouchEvent, contextMenuId: string) {
		event.preventDefault()
		event.stopPropagation()

		console.log('contextMenu', this.contextMenu)
		const toolbarRect = this.mobileToolbar.nativeElement.getBoundingClientRect()
		const top = toolbarRect.top
		const button = event.target as HTMLButtonElement

		const rect = button.getBoundingClientRect()
		/*		if (isRectRightSide(rect)) {

		 }*/
		this.contextMenuLocation.x = rect.left
		this.contextMenuLocation.y = top
		if (contextMenuId === 'main-context-menu') {
			this.contextMenuLocation.x = toolbarRect.left
			// this.contextMenuLocation.x = toolbarRect.left
		}

		// const div = this.contextMenu.find((c) => c.nativeElement.id === contextMenuId)
		const isOpen = this.contextMenuOpen() === contextMenuId
		if (isOpen) {
			this.contextMenuOpen.set(undefined)
			return
		}
		this.contextMenuOpen.set(contextMenuId)

		const kill = this._renderer.listen(document, 'touchstart', (event: TouchEvent) => {
			const target = event.target as HTMLElement
			if (target.role !== 'menuitem') {
				this.contextMenuOpen.set(undefined)
				kill()
			}
		})
	}

	initDiv(div: HTMLDivElement | HTMLUListElement) {
		const rect = div.getBoundingClientRect()
		// const top = this.contextMenuLocation.y
		const top = this.contextMenuLocation.y - rect.height
		// const top = this.contextMenuLocation.y - rect.height
		let left = this.contextMenuLocation.x
		// let right = this.contextMenuLocation.x + rect.width
		// let left = this.contextMenuLocation.x - rect.width / 2
		const screenOffset = window.innerWidth * 0.1
		if (left < 0) {
			left = screenOffset
		}
		if (left + rect.width > window.innerWidth) {
			left = window.innerWidth - rect.width - screenOffset
		}
		const toolbarRect = this.mobileToolbar.nativeElement.getBoundingClientRect()
		// right = left + toolbarRect.right
		const width = toolbarRect.width
		/*		if (isRectInLastQuarter(rect)) {
		 console.log('isRectRightSide')
		 left = this.contextMenuLocation.x - rect.width
		 // this._renderer.setStyle(div, 'left', left + 'px')
		 // this._renderer.setStyle(div, 'top', top + 'px')
		 // return
		 }*/
		// const top = this.contextMenuLocation.y - rect.height
		// const left = this.contextMenuLocation.x
		this._renderer.setStyle(div, 'top', top + 'px')
		this._renderer.setStyle(div, 'left', left + 'px')
		this._renderer.setStyle(div, 'width', width + 'px')
		const container = this.contextMenu.find((c) => c.nativeElement.id === 'main-context-menu')
		if (container) {
			this._renderer.setStyle(div, 'width', width + 'px')
		}

		const height = top - this.mobileToolbar.nativeElement.getBoundingClientRect().top
		this._renderer.setStyle(div, 'height', height + 'px')
	}

	selectMode(mode: ModeState) {
		this._appStore.setModeState(mode)
		this.contextMenuOpen.set(undefined)
	}
}

const isRectInLastQuarter = (rect: DOMRect) => {
	console.log('isRectInLastQuarter', rect.right, window.innerWidth * 0.75)
	return rect.right > window.innerWidth * 0.75
}

const isRectRightSide = (rect: DOMRect) => {
	return rect.right > window.innerWidth
}

const isRectBottomSide = (rect: DOMRect) => {
	return rect.bottom > window.innerHeight
}

const isRectLeftSide = (rect: DOMRect) => {
	return rect.left < 0
}

const isRectTopSide = (rect: DOMRect) => {
	return rect.top < 0
}

const isDivRightSide = (div: HTMLDivElement) => {
	const rect = div.getBoundingClientRect()
	return rect.right > window.innerWidth
}

const isDivBottomSide = (div: HTMLDivElement) => {
	const rect = div.getBoundingClientRect()
	return rect.bottom > window.innerHeight
}

const isDivLeftSide = (div: HTMLDivElement) => {
	const rect = div.getBoundingClientRect()
	return rect.left < 0
}

const isDivTopSide = (div: HTMLDivElement) => {
	const rect = div.getBoundingClientRect()
	return rect.top < 0
}
