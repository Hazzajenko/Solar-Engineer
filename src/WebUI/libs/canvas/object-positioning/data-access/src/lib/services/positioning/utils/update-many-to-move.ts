import { EventPoint, Point } from '@shared/data-access/models'
import { PanelModel } from '@entities/shared'

export const updateManyToMove = (
	multiToMoveStart: EventPoint,
	dragStopPoint: Point,
	scale: number,
	entities: PanelModel[],
) => {
	const offset = {
		x: (dragStopPoint.x - multiToMoveStart.x) / scale,
		y: (dragStopPoint.y - multiToMoveStart.y) / scale,
	}

	return entities.map((entity) => ({
		...entity,
		location: {
			x: entity.location.x + offset.x,
			y: entity.location.y + offset.y,
		},
	}))
}
