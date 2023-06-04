import { makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import {
	selectAllSignalrEvents,
	selectSignalrEventById,
	selectSignalrEventsEntities,
} from './signalr-events.selectors'
import { SignalrEventsActions } from './signalr-events.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { SignalrEventRequest } from '@entities/shared'
import { SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer } from './signalr-events.reducer'
import { createRootServiceInjector } from '@shared/utils'

export function provideSignalrEventsFeature() {
	return makeEnvironmentProviders([provideState(SIGNALR_EVENTS_FEATURE_KEY, signalrEventsReducer)])
}

export function injectSignalrEventsStore(): SignalrEventsStoreFactory {
	return signalrEventsStoreInjector()
}

const signalrEventsStoreInjector = createRootServiceInjector(signalrEventsStoreFactory, {
	deps: [Store],
})

export type SignalrEventsStoreFactory = ReturnType<typeof signalrEventsStoreFactory>

export function signalrEventsStoreFactory(store: Store) {
	const entities = store.selectSignal(selectSignalrEventsEntities)

	const select = {
		allSignalrEvents: store.selectSignal(selectAllSignalrEvents),
		getById: (id: string) => entities()[id],
		selectById: (id: string) => store.selectSignal(selectSignalrEventById({ id })),
	}

	const dispatch = {
		addSignalrEvent: (signalrEvent: SignalrEventRequest) =>
			store.dispatch(SignalrEventsActions.addSignalrEvent({ signalrEvent })),
		addManySignalrEvents: (signalrEvents: SignalrEventRequest[]) =>
			store.dispatch(SignalrEventsActions.addManySignalrEvents({ signalrEvents })),
		updateSignalrEvent: (update: UpdateStr<SignalrEventRequest>) =>
			store.dispatch(SignalrEventsActions.updateSignalrEvent({ update })),
		updateManySignalrEvents: (updates: UpdateStr<SignalrEventRequest>[]) =>
			store.dispatch(SignalrEventsActions.updateManySignalrEvents({ updates })),
		deleteSignalrEvent: (signalrEventId: SignalrEventRequest['requestId']) =>
			store.dispatch(SignalrEventsActions.deleteSignalrEvent({ signalrEventId })),
		deleteManySignalrEvents: (signalrEventIds: SignalrEventRequest['requestId'][]) =>
			store.dispatch(SignalrEventsActions.deleteManySignalrEvents({ signalrEventIds })),
		clearSignalrEventsState: () => store.dispatch(SignalrEventsActions.clearSignalrEventsState()),
	}

	return {
		select,
		dispatch,
	}
}
