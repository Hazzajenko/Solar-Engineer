import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CHAT_ROOMS_FEATURE_KEY, ChatRoomsState } from './chat-rooms.reducer'

export const selectChatRoomsState = createFeatureSelector<ChatRoomsState>(CHAT_ROOMS_FEATURE_KEY)

export const selectChatRoomToMessage = createSelector(
  selectChatRoomsState,
  (chatRooms) => chatRooms.chatRoomToMessage,
)
export const selectUserNameToMessage = createSelector(
  selectChatRoomsState,
  (chatRooms) => chatRooms.userNameToMessage,
)

export const selectGroupIdToMessage = createSelector(
  selectChatRoomsState,
  (chatRooms) => chatRooms.groupIdToMessage,
)

export const selectCurrentChatRoom = createSelector(selectChatRoomsState, (chatRooms) =>
  // chatRooms.inGroup ? chatRooms.groupIdToMessage : chatRooms.userNameToMessage,
  ({
    inGroup: chatRooms.inGroup,
    toMessage: chatRooms.inGroup ? chatRooms.groupIdToMessage : chatRooms.userNameToMessage,
  }),
)
