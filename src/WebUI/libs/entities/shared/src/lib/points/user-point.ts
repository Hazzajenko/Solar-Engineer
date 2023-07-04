import { Point } from '@shared/data-access/models'

export type UserPoint = Point & {
	id: string
	userId: string
	time: number
}
