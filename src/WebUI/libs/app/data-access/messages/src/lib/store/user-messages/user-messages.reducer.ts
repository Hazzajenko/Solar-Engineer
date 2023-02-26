import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'

import { UserMessagesActions } from './user-messages.actions'

export const USER_MESSAGES_FEATURE_KEY = 'user-user-messages'

export interface UserMessagesState extends EntityState<MessageModel> {
  loaded: boolean
  error?: string | null
}

export function selectId(a: MessageModel): number {
  return a.id
}

export const messagesAdapter: EntityAdapter<MessageModel> = createEntityAdapter<MessageModel>({
  selectId,
})

export const initialMessagesState: UserMessagesState = messagesAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialMessagesState,
  on(UserMessagesActions.initMessages, (state) => ({ ...state, loaded: false, error: null })),
  on(UserMessagesActions.addMessage, (state, { message }) =>
    messagesAdapter.addOne(message, state),
  ),
  on(UserMessagesActions.addReceivedMessage, (state, { message }) =>
    messagesAdapter.addOne(message, state),
  ),
  on(UserMessagesActions.addManyMessages, (state, { messages }) =>
    messagesAdapter.addMany(messages, state),
  ),
  on(UserMessagesActions.updateMessage, (state, { update }) =>
    messagesAdapter.updateOne(update, state),
  ),
  on(UserMessagesActions.updateManyMessages, (state, { updates }) =>
    messagesAdapter.updateMany(updates, state),
  ),
  on(UserMessagesActions.deleteMessage, (state, { messageId }) =>
    messagesAdapter.removeOne(messageId, state),
  ),
  on(UserMessagesActions.deleteManyMessages, (state, { messageIds }) =>
    messagesAdapter.removeMany(messageIds, state),
  ),
  on(UserMessagesActions.clearMessagesState, (state) => messagesAdapter.removeAll(state)),
)

export function userMessagesReducer(state: UserMessagesState | undefined, action: Action) {
  return reducer(state, action)
}
