import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'

import { MessagesActions } from './messages.actions'

export const MESSAGES_FEATURE_KEY = 'messages'

export interface MessagesState extends EntityState<MessageModel> {
  loaded: boolean
  error?: string | null
}

export function selectId(a: MessageModel): number {
  return a.id
}

export const messagesAdapter: EntityAdapter<MessageModel> = createEntityAdapter<MessageModel>({
  selectId,
})

export const initialMessagesState: MessagesState = messagesAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialMessagesState,
  on(MessagesActions.initMessages, (state) => ({ ...state, loaded: false, error: null })),
  on(MessagesActions.addMessage, (state, { message }) =>
    messagesAdapter.addOne(message, state),
  ),
  on(MessagesActions.addReceivedMessage, (state, { message }) =>
    messagesAdapter.addOne(message, state),
  ),
  on(MessagesActions.addManyMessages, (state, { messages }) =>
    messagesAdapter.addMany(messages, state),
  ),
  on(MessagesActions.updateMessage, (state, { update }) =>
    messagesAdapter.updateOne(update, state),
  ),
  on(MessagesActions.updateManyMessages, (state, { updates }) =>
    messagesAdapter.updateMany(updates, state),
  ),
  on(MessagesActions.deleteMessage, (state, { messageId }) =>
    messagesAdapter.removeOne(messageId, state),
  ),
  on(MessagesActions.deleteManyMessages, (state, { messageIds }) =>
    messagesAdapter.removeMany(messageIds, state),
  ),
  on(MessagesActions.clearMessagesState, (state) =>
    messagesAdapter.removeAll(state),
  ),
)

export function messagesReducer(state: MessagesState | undefined, action: Action) {
  return reducer(state, action)
}
