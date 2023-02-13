import { GroupChatServerMessageModel } from './group-chat-server-message.model'
import { GroupChatMessageModel } from './group-chat-message.model'
import { MessageFrom } from './message-from.model'

export interface GroupChatMemberModel {
  id: number
  groupChatId: number
  displayName: string
  firstName: string
  lastName: string
  lastActive: string
  photoUrl: string
  role: string
  joinedAt: string
  isOnline: boolean
  // isServer: boolean
  isFriend: boolean
  becameFriendsTime: string | null
  // messageFrom: typeof(MESSAGE_FROM)
}

/*export interface GroupChatMemberModel {
  id: number
  groupChatId: number
  userName: string
  firstName: string
  lastName: string
  lastActive: string
  photoUrl: string
  role: string
  joinedAt: string
  isOnline: boolean
  // isServer: boolean
  isFriend: boolean
  becameFriendsTime: string | null
  // messageFrom: typeof(MESSAGE_FROM)
}*/

/*id: number
groupChatId: number
content: string
messageSentTime: string*/
export const GROUP_CHAT_SERVER_MESSAGE_MODEL = (serverMessage: GroupChatServerMessageModel) =>
  ({
    id: 0,
    groupChatId: 0,
    content: serverMessage.content,
    messageSentTime: serverMessage.messageSentTime,
    senderDisplayName: 'SERVER',
    messageReadTimes: [],
    isServer: true,
    isUserSender: false,
    messageFrom: MessageFrom.Server,
  } as GroupChatMessageModel)

export const GROUP_CHAT_SERVER_MEMBER_MODEL = () =>
  ({
    displayName: 'SERVER',
    role: 'SERVER',
    // isServer: true,
  } as GroupChatMemberModel)
/*export const GROUP_CHAT_SERVER_MEMBER_MODEL = () =>
  ({
    id: 0,
    groupChatId: 0,
    userName: 'SERVER',
    firstName: 'SERVER',
    lastName: 'SERVER',
    role: 'SERVER',
    isServer: true,
    isOnline: true,
    isFriend: false,
    becameFriendsTime: null,

  } as GroupChatMemberModel)*/

/*export const GROUP_CHAT_SERVER_MEMBER_MODEL: GroupChatMemberModel = {
  id: 0,
  groupChatId: 0,
  userName: 'SERVER',
  firstName: 'SERVER',
  lastName: 'SERVER',
  role: 'SERVER',
  isServer: true,
  isOnline: true,
  isFriend: false,
  becameFriendsTime: null,
  joinedAt: '',
  lastActive: '',
  photoUrl: '',
}*/

/*
export interface WebUserModel {
  email: string
  firstName: string
  lastName: string
  userName: string
  photoUrl: string
  created: string
  lastActive: string
  isOnline: boolean
  isFriend: boolean
  becameFriendsTime: string | null
}
*/
