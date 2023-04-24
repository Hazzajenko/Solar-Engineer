import { AngleRadians } from '../../../utils'
import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type ToMoveState = {
	singleToMove: SingleToMove | undefined
	// multiToMoveStart: Point | undefined
	multipleToMove: MultipleToMove | undefined
}

export type SingleToMove = {
	id: string
	type: EntityType
	location: Point
	angle: AngleRadians
}

export type MultipleToMove = {
	ids: string[]
	startPoint: Point
	offset: Point
	entities: MultipleToMoveEntity[]
}

export type MultipleToMoveEntity = {
	id: string
	type: EntityType
	location: Point
	angle: AngleRadians
}
export const InitialToMoveState: ToMoveState = {
	// ids: [],
	// entities: {},
	singleToMove: undefined,
	multipleToMove: undefined, // multiToMoveStart: undefined,
}

export type AdjustedToMoveState = {
	singleToMove: boolean
	// singleToMove: AdjustedSingleToMove | undefined
	multipleToMove: boolean
	// multipleToMove: AdjustedMultipleToMove | undefined
}

export type AdjustedSingleToMove = {
	id: string
	location: Point
	angle: AngleRadians
}

export type AdjustedMultipleToMove = {
	ids: string[]
	startPoint: Point
	offset: Point
	entities: AdjustedMultipleToMoveEntity[]
}

export type AdjustedMultipleToMoveEntity = {
	id: string
	location: Point
	angle: AngleRadians
}

export const InitialAdjustedToMoveState: AdjustedToMoveState = {
	// ids: [],
	// entities: {},
	singleToMove: false, // singleToMove: undefined,
	multipleToMove: false, // multipleToMove: undefined, // multiToMoveStart: undefined,
}