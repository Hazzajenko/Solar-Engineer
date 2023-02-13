import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatServerMessageModel } from '@shared/data-access/models'

export const GroupChatServerMessagesActions = createActionGroup({
  source: 'Group Chat Server Messages Store',
  events: {
    'Init Group Chat Messages': emptyProps(),
    'Add Group Chat Server Message': props<{
      groupChatServerMessage: GroupChatServerMessageModel
    }>(),
    'Add Many Group Chat Server  Messages': props<{
      groupChatServerMessages: GroupChatServerMessageModel[]
    }>(),
    'Update Group Chat Message': props<{ update: Update<GroupChatServerMessageModel> }>(),
    'Update Many Group Chat Messages': props<{ updates: Update<GroupChatServerMessageModel>[] }>(),
    'Remove Group Chat Server Message': props<{ groupChatServerMessageId: number }>(),
    'Remove Many Group Chat Server Messages': props<{ groupChatServerMessageIds: number }>(),
    'Clear Group Chat Messages State': emptyProps(),
  },
})
