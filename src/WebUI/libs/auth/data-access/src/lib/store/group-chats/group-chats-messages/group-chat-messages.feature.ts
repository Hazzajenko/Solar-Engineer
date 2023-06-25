import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { GROUP_CHAT_MESSAGES_FEATURE_KEY, groupChatMessagesReducer } from './group-chat-messages.reducer'

// import * as GroupChatMessagesEffects from './group-chat-messages.effects'

export function provideGroupChatMessagesFeature() {
	return makeEnvironmentProviders([
		provideState(GROUP_CHAT_MESSAGES_FEATURE_KEY, groupChatMessagesReducer), // provideEffects(GroupChatMessagesEffects),
	])
}
