/*
 import {
 Directive,
 ElementRef,
 EventEmitter,
 inject,
 Input,
 NgZone,
 OnInit,
 Output,
 Renderer2,
 } from '@angular/core'

 import {
 BlockRectModel,
 ClickService,
 DoubleClickService,
 ElementOffsets,
 MouseService,
 MultiStoreService,
 PanelsStoreService,
 } from '@grid-layout/data-access'
 import { BaseService } from '@shared/logger'
 import {
 GridMode,
 SelectedPanelLinkPathModel,
 SelectedPathModel,
 VibrantColor,
 } from '@shared/data-access/models'
 import {
 downAndLeft,
 downAndRight,
 handleXAxisSame,
 handleYAxisSame,
 upAndLeft,
 upAndRight,
 } from './utils/handle-axis'

 @Directive({
 selector: '[appNoGridWrapperDirective]',
 standalone: true,
 })
 export class NoGridWrapperDirective extends BaseService implements OnInit {
 private multiStore = inject(MultiStoreService)

 private elementRef = inject(ElementRef<HTMLDivElement>)
 private renderer = inject(Renderer2)
 private mouseService = inject(MouseService)
 private clickService = inject(ClickService)
 private doubleClickService = inject(DoubleClickService)
 private panelsStore = inject(PanelsStoreService)
 currentGridMode = GridMode.UNDEFINED
 canvas!: HTMLCanvasElement
 ctx!: CanvasRenderingContext2D

 scale = 1
 pageX?: number
 pageY?: number
 startX?: number
 startY?: number
 offsetX?: number
 offsetY?: number
 isDragging = false
 altKeyDragging = false

 height!: number
 negativeHeight!: number

 width!: number
 negativeWidth!: number
 middleClickDown = false
 fillStyle = '#7585d8'
 pathMapAnimationId?: number
 pathMapAnimating = false
 selectedPaths?: SelectedPanelLinkPathModel
 fpsInterval = 1000 / 60
 startTime = Date.now()

 lines: { x: number; y: number }[] = []
 parentHeight?: number
 parentWidth?: number
 private directiveInitialized = false

 constructor(private ngZone: NgZone) {
 super()
 }


 private onMouseUpHandler(event: MouseEvent) {
 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
 this.startX = undefined
 this.startY = undefined
 if (this.isDragging || event.ctrlKey) {
 this.isDragging = false
 this.elementRef.nativeElement.style.cursor = ''
 return
 }

 const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
 if (!location) return
 return this.mouseService.mouse({ event, location })
 }

 private onMouseDownHandler(event: MouseEvent) {
 if (event.ctrlKey || event.button === 1) {
 const rect = this.elementRef.nativeElement.getBoundingClientRect()
 this.startX = event.clientX - rect.left
 this.startY = event.clientY - rect.top
 this.isDragging = true
 if (event.button === 1) {
 this.middleClickDown = true
 }
 return
 }
 if (event.altKey) {
 this.altKeyDragging = true
 if (!event.pageX || !event.pageY) {
 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
 this.startX = undefined
 this.startY = undefined
 return
 }

 const rect = this.canvas.getBoundingClientRect()

 this.startX = event.pageX - rect.left
 this.startY = event.pageY - rect.top
 }

 this.isDragging = false
 this.middleClickDown = false
 // const clientX = event.clientX
 // const clientY = event.clientY

 const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
 if (!location) return

 return this.mouseService.mouse({ event, location })
 }

 private setupMouseEventListeners() {
 this.ngZone.runOutsideAngular(() => {
 this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
 event.stopPropagation()
 event.preventDefault()
 this.onMouseDownHandler(event)
 })
 this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
 event.stopPropagation()
 event.preventDefault()
 this.onMouseUpHandler(event)
 })
 this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
 event.stopPropagation()
 event.preventDefault()
 this.onMouseMoveHandler(event)
 })
 this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => {
 event.stopPropagation()
 event.preventDefault()
 this.handleClickEvent(event)
 })
 this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (event: MouseEvent) => {
 event.stopPropagation()
 event.preventDefault()
 this.handleDoubleClickEvent(event)
 })
 })
 }

 private handleClickEvent(event: MouseEvent) {
 if (event.ctrlKey) return

 const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
 if (location) {
 return this.clickService.click({ event: event as MouseEvent, location })
 }
 if (!location) {
 const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
 if (!secondDiv) return
 return this.clickService.click({ event: event as MouseEvent, location: secondDiv })
 }
 return
 }

 private handleDoubleClickEvent(event: MouseEvent) {
 const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
 if (location) {
 return this.doubleClickService.doubleCLick({ event: event as MouseEvent, location })
 }
 if (!location) {
 const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
 if (!secondDiv) return
 return this.doubleClickService.doubleCLick({
 event: event as MouseEvent,
 location: secondDiv,
 })
 }
 return
 }

 private onMouseMoveHandler(event: MouseEvent) {
 if (!this.startX || !this.startY || (!this.isDragging && !this.altKeyDragging)) {
 this.isDragging = false
 this.middleClickDown = false
 return
 }

 if (event.altKey) {
 if (!this.startX || !this.startY || !event.altKey) {
 return
 } else {
 this.pageX = event.pageX
 this.pageY = event.pageY
 }
 this.ngZone.runOutsideAngular(() => {
 this.animate()
 })
 }

 if (!event.ctrlKey) {
 return
 }

 const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
 const mouseX =
 event.pageX -
 (parentRect.width - this.width) / 2 -
 this.elementRef.nativeElement.parentNode.offsetLeft

 const mouseY =
 event.pageY -
 (parentRect.height - this.height) / 2 -
 this.elementRef.nativeElement.parentNode.offsetTop

 const newStartY = this.startY
 const newStartX = this.startX

 const top = mouseY - newStartY
 const left = mouseX - newStartX

 if (
 top > (this.height * this.scale) / 2 ||
 top < this.negativeHeight / 2 - this.scale * 200 + this.height / 4.485
 ) {
 return
 }

 if (
 left > (this.width * this.scale) / 2 ||
 left < this.negativeWidth / 2 - this.scale * 200 + this.width / 5.925
 ) {
 return
 }

 this.elementRef.nativeElement.style.top = top + 'px'
 this.elementRef.nativeElement.style.left = left + 'px'
 this.elementRef.nativeElement.style.cursor = 'grab'
 return
 }

 animate() {
 if (!this.startX || !this.startY || !this.pageX || !this.pageY) {
 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
 return
 }
 const rect = this.canvas.getBoundingClientRect()

 const mouseX = this.pageX - rect.left
 const mouseY = this.pageY - rect.top

 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

 const width = mouseX - this.startX
 const height = mouseY - this.startY

 this.ctx.globalAlpha = 0.4

 this.ctx.fillStyle = this.fillStyle

 this.ctx.fillRect(this.startX, this.startY, width, height)

 this.ctx.globalAlpha = 1.0

 requestAnimationFrame(() => this.animate())
 }

 ngOnInit(): void {
 this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
 this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1
 this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
 this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1
 this.setupMouseEventListeners()
 const parentElement = this.elementRef.nativeElement.parentElement
 this.canvas = parentElement.querySelector('canvas')
 const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
 this.parentHeight = parentRect.height
 this.parentWidth = parentRect.width

 let ctx = this.canvas.getContext('2d')
 ctx = this.throwIfNull(ctx)

 this.ctx = ctx
 // this.ctx.globalAlpha = 0.4
 this.directiveInitialized = true
 }
 }
 */
