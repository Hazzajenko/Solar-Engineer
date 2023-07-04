import { USER_POINTS_FEATURE_KEY, userPointsAdapter, UserPointsState } from './user-points.reducer'
import { UserPoint } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectPointsState = createFeatureSelector<UserPointsState>(USER_POINTS_FEATURE_KEY)

const { selectAll, selectEntities } = userPointsAdapter.getSelectors()

export const selectAllPoints = createSelector(selectPointsState, (state: UserPointsState) =>
	selectAll(state),
)

export const selectPointsEntities = createSelector(selectPointsState, (state: UserPointsState) =>
	selectEntities(state),
)

export const selectPointById = (props: { id: string }) =>
	createSelector(selectPointsEntities, (userPoints: Dictionary<UserPoint>) => userPoints[props.id])

export const selectPointsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllPoints, (userPoints: UserPoint[]) =>
		userPoints.filter((userPoint) => props.ids.includes(userPoint.id)),
	)

export const selectPointsByUserId = (props: { userId: string }) =>
	createSelector(selectAllPoints, (userPoints: UserPoint[]) =>
		userPoints.filter((userPoint) => userPoint.userId === props.userId),
	)

export const selectPointsByUserIdSortedByTime = (props: { userId: string }) =>
	createSelector(selectPointsByUserId(props), (userPoints: UserPoint[]) =>
		userPoints.sort((a, b) => b.time - a.time),
	)
