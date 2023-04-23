import { Axis } from '../../../types'
import { CompleteEntityBounds, EntityBounds } from '../../../utils'

export type GridState = {
  showGrid: boolean
  showAxis: boolean
  showRuler: boolean
  currentAxis: Axis | undefined
  xAxisLineBounds: EntityBounds | undefined
  yAxisLineBounds: EntityBounds | undefined
  axisPreviewRect: CompleteEntityBounds | undefined
}

export const InitialGridState: GridState = {
  showGrid: true,
  showAxis: true,
  showRuler: true,
  currentAxis: undefined,
  xAxisLineBounds: undefined,
  yAxisLineBounds: undefined,
  axisPreviewRect: undefined,
}