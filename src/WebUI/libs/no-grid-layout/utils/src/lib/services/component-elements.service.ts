import { ElementRef, inject, Injectable, QueryList } from '@angular/core'
import { FreePanelComponent } from '@no-grid-layout/feature'
import { FreeBlockRectModel, FreeBlockType } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'

@Injectable({
  providedIn: 'root',
})
export class ComponentElementsService {
  get scrollElement(): HTMLDivElement {
    return this._scrollElement
  }

  set scrollElement(value: HTMLDivElement) {
    this._scrollElement = value
    const scrollRect = this.scrollElement.getBoundingClientRect()
    console.log('set scrollElement', scrollRect)
  }

  private _parentElement!: HTMLDivElement
  private _gridLayoutElement!: HTMLDivElement
  private _scrollElement!: HTMLDivElement
  public divs!: QueryList<ElementRef<HTMLDivElement>>
  public freePanelComponents!: QueryList<FreePanelComponent>

  private _elements: Element[] = []
  private _mousePositionService = inject(MousePositionService)
  public parentElement!: HTMLDivElement
  public gridLayoutElement!: HTMLDivElement
  // private _scrollElement!: HTMLDivElement
  public canvasElement!: HTMLCanvasElement
  public canvasCtx!: CanvasRenderingContext2D
  initialGridLayoutElementOffset!: {
    left: number,
    top: number
  }

  get elements(): Element[] {
    return this._elements
  }

  set elements(value: Element[]) {
    this._elements = value
    console.log('set elements', this._elements)
  }

  addToElements(element: Element) {
    this._elements.push(element)
    console.log('addToElements', this._elements)
  }

  public getComponentElementsByType(freeBlockType: FreeBlockType) {
    return this._elements.filter((e) => e.getAttribute('type') === freeBlockType)
  }

  public getComponentElementById(id: string) {
    return this._elements.find((fp) => fp.id === id)
  }

  public getComponentElementRectsWithId() {
    return this._elements.map(element => {
      // return this.getBlockRectFromElement(element)
      const rect = element.getBoundingClientRect()
      return {
        id:     element.id,
        left:   rect.left,
        top:    rect.top,
        width:  rect.width,
        height: rect.height,
        x:      rect.x,
        y:      rect.y,
      }
    })

  }

  getComponentElementRectById(id: string) {
    const element = this.getComponentElementById(id)
    if (!element) return null
    // return this.getBlockRectFromElement(element)
    const rect = element.getBoundingClientRect()
    return {
      id:     element.id,
      left:   rect.left,
      top:    rect.top,
      width:  rect.width,
      height: rect.height,
      x:      rect.x,
      y:      rect.y,
    }
  }

  getOffset(gridLayoutElement: HTMLDivElement) {
    const rect = gridLayoutElement.getBoundingClientRect()
    return {
      left: rect.left + window.scrollX,
      top:  rect.top + window.scrollY,
    }
  }

  getGridElementOffsets() {
    // const gridLayoutElement = this.gridLayoutElement
    const parentRect = this.parentElement.getBoundingClientRect()
    const rect = this.gridLayoutElement.getBoundingClientRect()

    return {
      left: rect.left - parentRect.left,
      top:  rect.top - parentRect.top,
    }

    /*    return {
     left: rect.left + window.scrollX,
     top:  rect.top + window.scrollY,
     }*/
  }

  getBlockRectById(id: string) {
    const element = this.getComponentElementById(id)
    if (!element) return null
    return this.getBlockRectFromElementV2(element)
  }

  private getBlockRectFromElement(element: Element): FreeBlockRectModel {
    const id = element.getAttribute('id')
    if (!id) {
      throw new Error('id not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvasElement.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return {
      id,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
      // element,
    }
  }

  private getBlockRectFromElementV2(element: Element): FreeBlockRectModel {
    const id = element.getAttribute('id')
    if (!id) {
      throw new Error('id not found')
    }
    const panelRect = element.getBoundingClientRect()
    const scrollRect = this._scrollElement.getBoundingClientRect()

    const x = (panelRect.left - scrollRect.left + (panelRect.width)) / this._mousePositionService.scale
    const y = (panelRect.top - scrollRect.top + (panelRect.height)) / this._mousePositionService.scale

    return {
      id,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
    }
  }

}