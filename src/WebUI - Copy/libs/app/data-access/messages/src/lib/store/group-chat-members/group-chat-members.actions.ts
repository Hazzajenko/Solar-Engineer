import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { InitialGroupChatMemberModel } from '@shared/data-access/models'
import { RemoveFromGroupChatRequest } from '../../models/requests/remove-from-group-chat.request'
import { InviteToGroupChatRequest } from '../../models/requests/invite-to-group-chat.request'

export const GroupChatMembersActions = createActionGroup({
  source: 'Group Chat Members Store',
  events: {
    'Init Group Chat Members': emptyProps(),
    'Remove User From Group': props<{ request: RemoveFromGroupChatRequest }>(),
    'Invite Group Chat Members': props<{ request: InviteToGroupChatRequest }>(),
    'Add Group Chat Member': props<{ groupChatMember: InitialGroupChatMemberModel }>(),
    'Add Many Group Chat Members': props<{ groupChatMembers: InitialGroupChatMemberModel[] }>(),
    'Update Group Chat Member': props<{ update: Update<InitialGroupChatMemberModel> }>(),
    'Remove Group Chat Member': props<{ groupChatMemberId: string }>(),
    'Remove Many Group Chat Members': props<{ groupChatMemberIds: string[] }>(),
    'Clear Group Chat Members State': emptyProps(),
  },
})
