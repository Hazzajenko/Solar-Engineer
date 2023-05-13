import { createActionGroup, props } from '@ngrx/store'
import { MessageTimeSortModel } from '@shared/data-access/models'

export const ChatRoomsActions = createActionGroup({
  source: 'Chatrooms Store',
  events: {
    'Select User To Message': props<{ userNameToMessage: string }>(),
    'Select Group To Message': props<{ groupIdToMessage: number }>(),
    'Select Chat Room To Message': props<{ chatRoomToMessage: MessageTimeSortModel }>(),
  },
})
