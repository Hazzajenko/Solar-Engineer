import {
  GroupChatMessageModel,
  GroupChatServerMessageModel,
  InitialGroupChatMemberModel,
  PermissionsModel,
} from '@shared/data-access/models'

export interface InitialCombinedGroupChatsResponse {
  groupChats: InitialCombinedGroupChat[]
}

export interface InitialCombinedGroupChat {
  id: number
  name: string
  photoUrl: string
  permissions: PermissionsModel
  members: InitialGroupChatMemberModel[]
  latestMessage: GroupChatMessageModel | null
  latestServerMessage: GroupChatServerMessageModel | null
}
