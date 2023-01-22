import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatMemberModel } from '@shared/data-access/models'

export const GroupChatMembersActions = createActionGroup({
  source: 'Group Chat Members Store',
  events: {
    'Init Group Chat Members': emptyProps(),
    'Add Group Chat Member': props<{ groupChatMember: GroupChatMemberModel }>(),
    'Add Many Group Chat Members': props<{ groupChatMembers: GroupChatMemberModel[] }>(),
    'Update Group Chat Member': props<{ update: Update<GroupChatMemberModel> }>(),
    'Remove Group Chat Member': props<{ groupChatMemberId: number }>(),
    'Clear Group Chat Members State': emptyProps(),
  },
})
