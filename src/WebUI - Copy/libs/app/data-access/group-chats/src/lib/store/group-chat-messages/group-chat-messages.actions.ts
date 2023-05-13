import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatMessageModel } from '@shared/data-access/models'
import { SendGroupChatMessageRequest } from '../../models'

export const GroupChatMessagesActions = createActionGroup({
  source: 'Group Chat Messages Store',
  events: {
    'Init Group Chat Messages': emptyProps(),
    'Send Message To Group Chat': props<{ request: SendGroupChatMessageRequest }>(),
    'Add Group Chat Message': props<{ groupChatMessage: GroupChatMessageModel }>(),
    'Add Many Group Chat Messages': props<{ groupChatMessages: GroupChatMessageModel[] }>(),
    'Update Group Chat Message': props<{ update: Update<GroupChatMessageModel> }>(),
    'Update Many Group Chat Messages': props<{ updates: Update<GroupChatMessageModel>[] }>(),
    'Remove Group Chat Message': props<{ groupChatMessageId: number }>(),
    'Clear Group Chat Messages State': emptyProps(),
  },
})
