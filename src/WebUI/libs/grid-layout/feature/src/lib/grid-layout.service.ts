import { Injectable } from '@angular/core'
import { ContainerSizes } from './container-sizes'

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  blockHeight = 32
  blockWidth = 32

  initContainerSize(innerHeight: number, innerWidth: number) {
    const gridContainerWidth = innerWidth
    const gridContainerHeight = innerHeight
    const gridContainerWidthString = `${innerWidth}px`
    const gridContainerHeightString = `${innerHeight}px`
    const rows = Math.floor((gridContainerHeight - 100) / this.blockHeight)
    const cols = Math.floor((gridContainerWidth - 100) / this.blockWidth)
    const layoutHeight = rows * this.blockHeight
    const layoutWidth = cols * this.blockWidth
    const layoutWidthString = `${layoutWidth}px`
    const layoutHeightString = `${layoutHeight}px`
    const backgroundHeightString = `${layoutHeight + 1}px`
    const backgroundWidthString = `${layoutWidth + 1}px`
    const containerSizes: ContainerSizes = {
      gridContainerWidthString,
      gridContainerHeightString,
      layoutWidthString,
      layoutHeightString,
      backgroundHeightString,
      backgroundWidthString,
    }
    return containerSizes
  }
}
