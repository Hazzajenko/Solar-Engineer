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
import { NgClass, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common'
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
	],
	templateUrl: './mobile-bottom-toolbar.component.html',
	styles: [],
	animations: [goTop, increaseTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomToolbarComponent {
	private _appStore = injectAppStateStore()
	@ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger
	@ViewChildren('contextMenu') contextMenus!: QueryList<ElementRef<HTMLDivElement>>
	@ViewChildren('temps') temps!: QueryList<ElementRef<HTMLDivElement>>
	// @ViewChild('contextMenu') contextMenu!: ElementRef<HTMLDivElement>
	@ViewChild('mobileToolbar') mobileToolbarRef!: ElementRef<HTMLDivElement>
	menuTopLeftPosition = { x: '0', y: '0' }
	contextMenuLocation = { x: 0, y: 0 } as Point
	_renderer = inject(Renderer2)
	_element = inject(ElementRef).nativeElement
	contextMenuOpen = signal<string | undefined>(undefined)
	currentContextMenuDiv = signal<ElementRef<HTMLDivElement> | undefined>(undefined)

	killContextMenu: (() => void) | undefined = undefined

	/*	currentContextMenuDiv = computed(() => {
	 const contextMenuId = this.contextMenuOpen()
	 if (!contextMenuId) {
	 console.log('contextMenuId', contextMenuId)
	 return undefined
	 }
	 if (!this.contextMenus) {
	 console.log('this.contextMenus', this.contextMenus)
	 return undefined
	 }
	 return this.contextMenus.find((c) => c.nativeElement.id === contextMenuId)
	 })*/
	/*	cssSignal = signal<string>(
	 `bottom-[calc(${this.mobileToolbarRef.nativeElement.getBoundingClientRect().top}px - ${
	 this.contextMenus.get(0)?.nativeElement.getBoundingClientRect().height
	 }px)]`,
	 )*/

	/*	cssSignal = computed(() => {
	 const top = this.mobileToolbarRef.nativeElement.getBoundingClientRect().top
	 const contextMenuHeight = this.contextMenus
	 .find((contextMenu) => contextMenu.nativeElement.id === 'main-context-menu')
	 ?.nativeElement.getBoundingClientRect().height
	 if (!contextMenuHeight) return `bottom-[calc(${top}px_-_0px)]`
	 // main-context-menu
	 return `bottom-[calc(${top}px_-_${contextMenuHeight}px)]`
	 })

	 mobileToolbarHeight = computed(() => {
	 if (getScreenSize() !== 640) return '0px'
	 if (!this.mobileToolbarRef) {
	 // setTimeout(() => this.mobileToolbarHeight(), 100)
	 return '0px'
	 }
	 const toolbarHeight = this.mobileToolbarRef.nativeElement.getBoundingClientRect().height
	 const contextMenuHeight =
	 this.currentContextMenuDiv()?.nativeElement.getBoundingClientRect().height ?? 0
	 return `${toolbarHeight + contextMenuHeight}px}`
	 })*/

	/*	constructor() {
	 const observer = new MutationObserver((mutations) => {
	 console.log(mutations)
	 mutations.forEach((mutation) => {
	 if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
	 const component = mutation.addedNodes[0] as HTMLDivElement
	 if (component instanceof SVGElement) {
	 console.log('svg')
	 return
	 }
	 if (!(component instanceof HTMLDivElement)) {
	 console.log('HTMLDivElement')
	 return
	 }

	 if (component.id === element.id) return
	 console.log('component', component)
	 const componentHeight = component.getBoundingClientRect().height
	 const elementRectHeight = this._element.getBoundingClientRect().height
	 const spaceY = 10
	 // const spaceY = 5
	 const newDivHeight = elementRectHeight + componentHeight + spaceY
	 console.log('component', component)
	 this.initialHeight = this._element.getBoundingClientRect().height
	 console.log(this.initialHeight)
	 this._renderer.setStyle(this._element, 'height', `${newDivHeight}px`)
	 }
	 if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
	 this._renderer.setStyle(this._element, 'height', `${this.initialHeight}px`)
	 }
	 })
	 })

	 const config = { childList: true, subtree: true }
	 observer.observe(this._element, config)
	 }*/

	get mode() {
		return this._appStore.mode()
	}

	toggleContextMenu(event: TouchEvent, contextMenuId: string) {
		event.preventDefault()
		event.stopPropagation()

		console.log('contextMenu', this.contextMenus)
		const toolbarRect = this.mobileToolbarRef.nativeElement.getBoundingClientRect()
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
			this.setContextMenuToUndefined()
			// this.contextMenuOpen.set(undefined)
			// if (this.killContextMenu) this.killContextMenu()
			console.log('isOpen', isOpen)
			return
		}
		this.contextMenuOpen.set(contextMenuId)
		console.log('this.contextMenuOpen.set(contextMenuId)', contextMenuId)
		console.log('this.contextMenus', this.contextMenus)

		// const menu = this.contextMenus.first
		const menu = this.contextMenus.find((c) => c.nativeElement.id === contextMenuId)
		if (!menu) {
			setTimeout(() => this.reFetchMenu(contextMenuId), 100)
			return
		}
		this.currentContextMenuDiv.set(menu)
		this.finishMenuFunction()
		/*console.log('menu', menu)
		 this.currentContextMenuDiv.set(
		 this.contextMenus.find((c) => c.nativeElement.id === contextMenuId),
		 )

		 const kill = this._renderer.listen(document, 'touchstart', (event: TouchEvent) => {
		 const target = event.target as HTMLElement
		 if (target.role !== 'menuitem') {
		 this.contextMenuOpen.set(undefined)
		 console.log('kill')
		 kill()
		 }
		 })

		 const current = this.currentContextMenuDiv()
		 console.log('current', current)

		 if (this.temps) {
		 console.log('temps', this.temps)
		 }*/

		/*const observer = new MutationObserver((mutations) => {
		 // Loop through the mutations and check if a new component has been added
		 mutations.forEach((mutation) => {
		 if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
		 // Get the height of the new component
		 const component = mutation.addedNodes[0] as HTMLDivElement
		 console.log('component', component)
		 if (component.id !== 'main-context-menu') return

		 // component.
		 const componentHeight = component.getBoundingClientRect().height
		 console.log('componentHeight', componentHeight)
		 // Get the current height of the div
		 // const divHeight = div.getBoundingClientRect().height

		 // Calculate the new height of the div
		 const newDivHeight = toolbarRect.height + componentHeight
		 console.log('newDivHeight', newDivHeight)
		 this._renderer.setStyle(
		 this.mobileToolbarRef.nativeElement,
		 'height',
		 `${newDivHeight}px`,
		 )

		 // Set the new height of the div
		 // div.style.height = `${newDivHeight}px`
		 }
		 if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
		 console.log('mutation.removedNodes', mutation.removedNodes)
		 }
		 })
		 })

		 // Configure the observer to watch for changes to the toolbar
		 const config = { childList: true, subtree: true }
		 observer.observe(this.mobileToolbarRef.nativeElement, config)*/
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
			console.log('target', target)
			if (target.role !== 'menuitem') {
				this.setContextMenuToUndefined()
			}
		})
		/*
		 const current = this.currentContextMenuDiv()
		 console.log('current', current)

		 if (this.temps) {
		 console.log('temps', this.temps)
		 }*/
	}

	setContextMenuToUndefined() {
		this.contextMenuOpen.set(undefined)
		this.currentContextMenuDiv.set(undefined)
		if (this.killContextMenu) this.killContextMenu()
	}

	initDiv(div: HTMLDivElement | HTMLUListElement) {
		const rect = div.getBoundingClientRect()
		// const top = this.contextMenuLocation.y
		/*		const top = this.contextMenuLocation.y - rect.height
		 console.log(`top: ${top} = ${this.contextMenuLocation.y} - ${rect.height}`)*/
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
		const toolbarRect = this.mobileToolbarRef.nativeElement.getBoundingClientRect()
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
		const toolbarTop = toolbarRect.top
		const top = toolbarTop - rect.height
		// const height = top - this.mobileToolbar.nativeElement.getBoundingClientRect().top
		// const top = this.contextMenuLocation.y - rect.height
		console.log(`top: ${top} = ${toolbarTop} - ${rect.height}`)
		// this._renderer.setStyle(div, 'top', top + 'px')
		this._renderer.setStyle(div, 'left', left + 'px')
		this._renderer.setStyle(div, 'width', width + 'px')
		const container = this.contextMenus.find((c) => c.nativeElement.id === 'main-context-menu')
		if (container) {
			this._renderer.setStyle(div, 'width', width + 'px')
		}

		// const height = top - this.mobileToolbar.nativeElement.getBoundingClientRect().top
		// this._renderer.setStyle(div, 'height', height + 'px')
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
