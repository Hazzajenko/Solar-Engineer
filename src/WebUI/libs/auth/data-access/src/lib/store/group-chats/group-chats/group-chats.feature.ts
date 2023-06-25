import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { GROUP_CHATS_FEATURE_KEY, groupChatsReducer } from './group-chats.reducer'

// import * as GroupChatsEffects from './group-chats.effects'

export function provideGroupChatsFeature() {
	return makeEnvironmentProviders([
		provideState(GROUP_CHATS_FEATURE_KEY, groupChatsReducer), // provideEffects(GroupChatsEffects),
	])
}
