import { Store } from '@ngrx/store'
import {
	selectAllPoints,
	selectPointsByUserId,
	selectPointsByUserIdSortedByTime,
	selectPointsEntities,
} from './user-points.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { UserPointsActions } from './user-points.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { UserPoint } from '@entities/shared'

export function injectUserPointsStore(): UserPointsStore {
	return userPointsStoreInjector()
}

const userPointsStoreInjector = createRootServiceInjector(userPointsStoreFactory, {
	deps: [Store],
})

export type UserPointsStore = ReturnType<typeof userPointsStoreFactory>

function userPointsStoreFactory(store: Store) {
	const allPoints = store.selectSignal(selectAllPoints)
	const entities = store.selectSignal(selectPointsEntities)

	const select = {
		allPoints,
		getById: (id: UserPoint['id']) => entities()[id],
		getByIds: (ids: UserPoint['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
		pointsByUserId: (props: { userId: string }) => store.selectSignal(selectPointsByUserId(props)),
		pointsByUserIdSortedByTime: (props: { userId: string }) =>
			store.selectSignal(selectPointsByUserIdSortedByTime(props)),
	}

	const dispatch = {
		addPoint: (userPoint: UserPoint) =>
			store.dispatch(UserPointsActions.addUserPoint({ userPoint })),
		addManyPoints: (userPoints: UserPoint[]) =>
			store.dispatch(UserPointsActions.addManyUserPoints({ userPoints })),
		updatePoint: (update: UpdateStr<UserPoint>) =>
			store.dispatch(UserPointsActions.updateUserPoint({ update })),
		updateManyPoints: (updates: UpdateStr<UserPoint>[]) =>
			store.dispatch(UserPointsActions.updateManyUserPoints({ updates })),
		deletePoint: (userPointId: UserPoint['id']) =>
			store.dispatch(UserPointsActions.deleteUserPoint({ userPointId })),
		deleteManyPoints: (userPointIds: UserPoint['id'][]) =>
			store.dispatch(UserPointsActions.deleteManyUserPoints({ userPointIds })),
		clearPointsState: () => store.dispatch(UserPointsActions.clearUserPointsState()),
	}

	return {
		select,
		dispatch,
	}
}
