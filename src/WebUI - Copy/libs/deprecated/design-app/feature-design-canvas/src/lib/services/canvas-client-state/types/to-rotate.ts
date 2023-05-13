import { Point } from '@shared/data-access/models'
import {
	AngleRadians,
	ClientState,
	ToRepositionEntity,
} from 'deprecated/design-app/feature-design-canvas'

export type ToRotateStateDeprecated = ClientState<ToRepositionEntity> & {
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

export const InitialToRotateState: ToRotateStateDeprecated = {
	ids: [],
	entities: {},
	singleToRotate: undefined,
	singleRotateMode: false,
	multipleToRotate: undefined, // },
}
/*

 export type AdjustedToRotateState = {
 singleRotateMode: boolean
 singleToRotate: boolean
 multipleToRotate: boolean
 }

 export const InitialAdjustedToRotateState: AdjustedToRotateState = {
 singleRotateMode: false,
 singleToRotate: false,
 multipleToRotate: false,
 }*/
