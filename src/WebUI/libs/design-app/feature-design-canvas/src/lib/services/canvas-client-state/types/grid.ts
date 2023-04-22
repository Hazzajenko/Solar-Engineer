import { EntityBounds } from '../../../utils'

export type GridState = {
  showGrid: boolean
  showAxis: boolean
  showRuler: boolean
  xAxisLineBounds: EntityBounds | undefined
  yAxisLineBounds: EntityBounds | undefined
}

export const InitialGridState: GridState = {
  showGrid: true,
  showAxis: true,
  showRuler: true,
  xAxisLineBounds: undefined,
  yAxisLineBounds: undefined,
}