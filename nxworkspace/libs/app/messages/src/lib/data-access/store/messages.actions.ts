import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'

export const MessagesActions = createActionGroup({
  source: 'Messages Store',
  events: {
    'Init Messages': emptyProps(),
    'Send Message To User': props<{ message: MessageModel }>(),
    'Add Message': props<{ message: MessageModel }>(),
    'Add Received Message': props<{ message: MessageModel }>(),
    'Add Many Messages': props<{ messages: MessageModel[] }>(),
    'Update Message': props<{ update: Update<MessageModel> }>(),
    'Update Many Messages': props<{ updates: Update<MessageModel>[] }>(),
    'Delete Message': props<{ messageId: number }>(),
    'Delete Many Messages': props<{ messageIds: number[] }>(),
    'Clear Messages State': emptyProps(),
  },
})
