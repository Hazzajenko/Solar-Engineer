import { ElementRef, Injectable, QueryList } from '@angular/core'
import { FreePanelComponent } from '@no-grid-layout/feature'

@Injectable({
  providedIn: 'root',
})
export class ComponentElementService {
  public divs!: QueryList<ElementRef<HTMLDivElement>>
  public freePanelComponents!: QueryList<FreePanelComponent>

  public getFreePanelComponents() {
    return this.freePanelComponents
  }

  public getFreePanelComponentsById(id: string) {
    return this.freePanelComponents.find((fp) => fp.panelId === id)
  }

  public getFreePanelComponentElementById(id: string) {
    return this.freePanelComponents.find((fp) => fp.panelId === id)?.elementRef.nativeElement
  }
  
  /* getBlockRect(panelId: string): FreeBlockRectModel | undefined {
   const panels = document.querySelectorAll('[panelId]')

   if (!panels) {
   return undefined
   }

   this.cachedPanels = Array.from(panels).map(panel => this.getBlockRectFromElement(panel))

   const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === panelId)

   if (!panelDiv) {
   return undefined
   }
   const panelRect = panelDiv.getBoundingClientRect()
   const canvasRect = this.canvas.getBoundingClientRect()
   const x = panelRect.left - canvasRect.left + panelRect.width / 2
   const y = panelRect.top - canvasRect.top + panelRect.height / 2
   return { id: panelId, x, y, height: panelRect.height, width: panelRect.width }
   }

   private getBlockRectFromElement(element: Element): FreeBlockRectModel {
   const panelId = element.getAttribute('panelId')
   if (!panelId) {
   throw new Error('panelId not found')
   }
   const panelRect = element.getBoundingClientRect()
   const canvasRect = this.canvas.getBoundingClientRect()
   const x = panelRect.left - canvasRect.left + panelRect.width / 2
   const y = panelRect.top - canvasRect.top + panelRect.height / 2

   return { id: panelId, x, y, height: panelRect.height, width: panelRect.width, element }
   }*/

}