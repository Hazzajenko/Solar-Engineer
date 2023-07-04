import { UserPointsActions } from './user-points.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { UserPoint } from '@entities/shared'

export const USER_POINTS_FEATURE_KEY = 'userPoints'

export interface UserPointsState extends EntityState<UserPoint> {
	loaded: boolean
	error?: string | null
}

export const userPointsAdapter: EntityAdapter<UserPoint> = createEntityAdapter<UserPoint>({
	selectId: (string) => string.id,
})

export const initialUserPointsState: UserPointsState = userPointsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialUserPointsState,
	on(UserPointsActions.addUserPoint, (state, { userPoint }) =>
		userPointsAdapter.addOne(userPoint, state),
	),
	on(UserPointsActions.addManyUserPoints, (state, { userPoints }) =>
		userPointsAdapter.addMany(userPoints, state),
	),
	on(UserPointsActions.updateUserPoint, (state, { update }) =>
		userPointsAdapter.updateOne(update, state),
	),
	on(UserPointsActions.updateManyUserPoints, (state, { updates }) =>
		userPointsAdapter.updateMany(updates, state),
	),
	on(UserPointsActions.deleteUserPoint, (state, { userPointId }) =>
		userPointsAdapter.removeOne(userPointId, state),
	),
	on(UserPointsActions.deleteManyUserPoints, (state, { userPointIds }) =>
		userPointsAdapter.removeMany(userPointIds, state),
	),
	on(UserPointsActions.clearUserPointsState, () => initialUserPointsState),
)

export function userPointsReducer(state: UserPointsState | undefined, action: Action) {
	return reducer(state, action)
}
