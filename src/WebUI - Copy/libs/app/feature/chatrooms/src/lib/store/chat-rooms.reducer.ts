import { Action, createReducer, on } from '@ngrx/store'
import { ChatRoomsActions } from './chat-rooms.actions'
import { MessageTimeSortModel } from '@shared/data-access/models'

export interface ChatRoomsState {
  userNameToMessage?: string
  groupIdToMessage?: number
  inGroup: boolean
  chatRoomToMessage?: MessageTimeSortModel
}

export const CHAT_ROOMS_FEATURE_KEY = 'chat-rooms'
export const initialChatRoomsState: ChatRoomsState = {
  userNameToMessage: undefined,
  groupIdToMessage: undefined,
  inGroup: false,
  chatRoomToMessage: undefined,
}

export const reducer = createReducer(
  initialChatRoomsState,

  on(ChatRoomsActions.selectUserToMessage, (state, { userNameToMessage }) => ({
    ...state,
    userNameToMessage,
    inGroup: false,
  })),
  on(ChatRoomsActions.selectGroupToMessage, (state, { groupIdToMessage }) => ({
    ...state,
    groupIdToMessage,
    inGroup: true,
  })),
  on(ChatRoomsActions.selectChatRoomToMessage, (state, { chatRoomToMessage }) => ({
    ...state,
    chatRoomToMessage,
  })),
)

export function chatRoomsReducer(state: ChatRoomsState | undefined, action: Action) {
  return reducer(state, action)
}
