import {
  GroupChatMessageModel,
  GroupChatServerMessageModel,
  InitialGroupChatMemberModel,
} from '@shared/data-access/models'

export interface InitialCombinedGroupChatsResponse {
  groupChats: InitialCombinedGroupChat[]
}

export interface InitialCombinedGroupChat {
  id: number
  name: string
  photoUrl: string
  members: InitialGroupChatMemberModel[]
  latestMessage: GroupChatMessageModel | null
  latestServerMessage: GroupChatServerMessageModel | null
}
