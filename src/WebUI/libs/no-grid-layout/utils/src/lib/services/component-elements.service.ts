import { ElementRef, Injectable, QueryList } from '@angular/core'
import { FreePanelComponent } from '@no-grid-layout/feature'
import { FreeBlockType } from '@no-grid-layout/shared'

@Injectable({
  providedIn: 'root',
})
export class ComponentElementsService {

  private _parentElement!: HTMLDivElement
  private _gridLayoutElement!: HTMLDivElement
  private _scrollElement!: HTMLDivElement
  public divs!: QueryList<ElementRef<HTMLDivElement>>
  public freePanelComponents!: QueryList<FreePanelComponent>

  private _elements: Element[] = []
  public parentElement!: HTMLDivElement
  public gridLayoutElement!: HTMLDivElement
  public scrollElement!: HTMLDivElement
  public canvasElement!: HTMLCanvasElement
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

  /*get parentElement(): HTMLDivElement {
   return this._parentElement
   }

   set parentElement(value: HTMLDivElement) {
   this._parentElement = value
   console.log('set parentElement', this._parentElement)
   }

   get gridLayoutElement(): HTMLDivElement {
   return this._gridLayoutElement
   }

   set gridLayoutElement(value: HTMLDivElement) {
   this._gridLayoutElement = value
   console.log('set gridLayoutElement', this._gridLayoutElement)
   this.initialGridLayoutElementOffset = this.getOffset(this._gridLayoutElement)
   }

   get scrollElement(): HTMLDivElement {
   return this._scrollElement
   }

   set scrollElement(value: HTMLDivElement) {
   this._scrollElement = value
   console.log('set scrollElement', this._scrollElement)
   }*/

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

}