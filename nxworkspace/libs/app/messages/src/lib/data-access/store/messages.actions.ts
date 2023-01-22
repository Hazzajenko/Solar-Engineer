import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'
import { SendMessageRequest } from '../models'

export const MessagesActions = createActionGroup({
  source: 'Messages Store',
  events: {
    'Init Messages': emptyProps(),
    'Init Messages With User': props<{ username: string }>(),
    'Send Message To User': props<{ request: SendMessageRequest }>(),
    'Add Message': props<{ message: MessageModel }>(),
    'Add Received Message': props<{ message: MessageModel }>(),
    'Add Many Messages': props<{ messages: MessageModel[] }>(),
    'Update Message': props<{ update: Update<MessageModel> }>(),
    'Update Many Messages': props<{ updates: Update<MessageModel>[] }>(),
    'Mark All Messages As Read With User': props<{ recipient: string }>(),
    'Delete Message': props<{ messageId: number }>(),
    'Delete Many Messages': props<{ messageIds: number[] }>(),
    'Clear Messages State': emptyProps(),
  },
})
