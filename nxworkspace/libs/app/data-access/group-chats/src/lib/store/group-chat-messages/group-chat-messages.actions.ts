import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatMessageModel } from '@shared/data-access/models'

export const GroupChatMessagesActions = createActionGroup({
  source: 'Group Chat Messages Store',
  events: {
    'Init Group Chat Messages': emptyProps(),
    'Add Group Chat Message': props<{ groupChatMessage: GroupChatMessageModel }>(),
    'Add Many Group Chat Message': props<{ groupChatMessages: GroupChatMessageModel[] }>(),
    'Update Group Chat Message': props<{ update: Update<GroupChatMessageModel> }>(),
    'Update Many Group Chat Messages': props<{ updates: Update<GroupChatMessageModel>[] }>(),
    'Remove Group Chat Message': props<{ groupChatMessageId: number }>(),
    'Clear Group Chat Messages State': emptyProps(),
  },
})
