import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatModel } from '@shared/data-access/models'
import { AllGroupChatsDataResponse } from '../../models/all-group-chats.response'
import { CreateGroupChatRequest } from '../../models'
import { InitialCombinedGroupChatsResponse } from '../../models/initial-combined-group-chats.response'

export const GroupChatsActions = createActionGroup({
  source: 'Group Chats Store',
  events: {
    'Init Group Chat Data': emptyProps(),
    'Init Group Chats': emptyProps(),
    'Create Group Chat': props<{ request: CreateGroupChatRequest }>(),
    'Get Group Chat Data': props<{ groupChatData: AllGroupChatsDataResponse }>(),
    'Get Initial Group Chat Combined Response': props<{
      response: InitialCombinedGroupChatsResponse
    }>(),
    'Init Group Chat': props<{ groupChatId: number }>(),
    'Add Group Chat': props<{ groupChat: GroupChatModel }>(),
    'Add Many Group Chats': props<{ groupChats: GroupChatModel[] }>(),
    'Update Group Chat': props<{ update: Update<GroupChatModel> }>(),
    'Remove Group Chat': props<{ groupChatId: number }>(),
    'Clear Group Chats State': emptyProps(),
  },
})
