import { AngleRadians, ClientState, ToRepositionEntity } from '@design-app/feature-design-canvas'
import { Point } from '@shared/data-access/models'

export type ToRotateState = ClientState<ToRepositionEntity> & {
  singleToRotate: SingleToRotate | undefined
  singleRotateMode: boolean
  multipleToRotate: MultipleToRotate | undefined
}

export type SingleToRotate = {
  id: string
  startPoint: Point
  startAngle: AngleRadians
  adjustedAngle?: AngleRadians
}

export type MultipleToRotate = {
  ids: string[]
  adjustedAngle?: AngleRadians
  pivotPoint?: Point
  startToPivotAngle?: AngleRadians
  entities: MultipleToRotateEntity[]
  // entities: Dictionary<MultipleToRotateEntity>
}

export type MultipleToRotateEntity = {
  id: string
  adjustedLocation: Point
}

export const InitialToRotateState: ToRotateState = {
  ids: [],
  entities: {},
  singleToRotate: undefined,
  singleRotateMode: false,
  multipleToRotate: undefined,
  // },
}