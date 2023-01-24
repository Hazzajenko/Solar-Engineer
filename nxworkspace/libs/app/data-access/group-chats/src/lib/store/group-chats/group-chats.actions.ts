import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatModel } from '@shared/data-access/models'
import { AllGroupChatsDataResponse } from '../../models/all-group-chats.response'
import { SendGroupChatMessageRequest } from '../../models'

export const GroupChatsActions = createActionGroup({
  source: 'Group Chats Store',
  events: {
    'Init Group Chat Data': emptyProps(),
    'Init Group Chats': emptyProps(),
    'Get Group Chat Data': props<{ groupChatData: AllGroupChatsDataResponse }>(),
    'Init Group Chat': props<{ groupChatId: number }>(),
    'Add Group Chat': props<{ groupChat: GroupChatModel }>(),
    'Add Many Group Chats': props<{ groupChats: GroupChatModel[] }>(),
    'Update Group Chat': props<{ update: Update<GroupChatModel> }>(),
    'Remove Group Chat': props<{ groupChatId: number }>(),
    'Clear Group Chats State': emptyProps(),
  },
})
