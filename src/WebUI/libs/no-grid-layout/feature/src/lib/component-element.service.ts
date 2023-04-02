import { ElementRef, Injectable, QueryList } from '@angular/core'
import { FreeBlockType, FreePanelComponent } from '@no-grid-layout/feature'

@Injectable({
  providedIn: 'root',
})
export class ComponentElementService {
  public divs!: QueryList<ElementRef<HTMLDivElement>>
  public freePanelComponents!: QueryList<FreePanelComponent>
  public elements: Element[] = []

  public getComponentElementsByType(freeBlockType: FreeBlockType) {
    return this.elements.filter((e) => e.getAttribute('type') === freeBlockType)
  }

  public getFreePanelComponentElementById(id: string) {
    return this.elements.find((fp) => fp.id === id)
  }
}