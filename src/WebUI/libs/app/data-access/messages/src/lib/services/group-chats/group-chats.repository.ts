import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import {
  GroupChatMemberModel,
  GroupChatMessageModel,
  GroupChatModel,
  InitialGroupChatMemberModel,
} from '@shared/data-access/models'
import { GroupChatMembersActions, GroupChatMessagesActions, GroupChatsActions } from '../../store'
import { SendGroupChatMessageRequest } from '../../models/requests/send-group-chat-message.request'
import { InviteToGroupChatRequest } from '../../models/requests/invite-to-group-chat.request'
import { CreateGroupChatRequest } from '../../models/requests/create-group-chat.request'
import { RemoveFromGroupChatRequest } from '../../models/requests/remove-from-group-chat.request'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsRepository {
  private store = inject(Store)

  initGroupChat(groupChatId: number) {
    this.store.dispatch(GroupChatsActions.initGroupChat({ groupChatId }))
  }

  sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
    this.store.dispatch(GroupChatMessagesActions.sendMessageToGroupChat({ request }))
  }

  inviteMembersToGroupChat(request: InviteToGroupChatRequest) {
    this.store.dispatch(GroupChatMembersActions.inviteGroupChatMembers({ request }))
  }

  createGroupChat(request: CreateGroupChatRequest) {
    this.store.dispatch(GroupChatsActions.createGroupChat({ request }))
  }

  addGroupChat(groupChat: GroupChatModel) {
    this.store.dispatch(GroupChatsActions.addGroupChat({ groupChat }))
  }

  updateGroupChat(update: Update<GroupChatModel>) {
    this.store.dispatch(GroupChatsActions.updateGroupChat({ update }))
  }

  removeGroupChat(groupChatId: number) {
    this.store.dispatch(GroupChatsActions.removeGroupChat({ groupChatId }))
  }

  addGroupChatMember(groupChatMember: GroupChatMemberModel) {
    this.store.dispatch(GroupChatMembersActions.addGroupChatMember({ groupChatMember }))
  }

  addManyGroupChatMembers(groupChatMembers: InitialGroupChatMemberModel[]) {
    this.store.dispatch(GroupChatMembersActions.addManyGroupChatMembers({ groupChatMembers }))
  }

  updateGroupChatMember(update: Update<GroupChatMemberModel>) {
    this.store.dispatch(GroupChatMembersActions.updateGroupChatMember({ update }))
  }

  removeGroupChatMember(groupChatMemberId: string) {
    this.store.dispatch(GroupChatMembersActions.removeGroupChatMember({ groupChatMemberId }))
  }

  removeUsersFromGroup(request: RemoveFromGroupChatRequest) {
    this.store.dispatch(GroupChatMembersActions.removeUserFromGroup({ request }))
  }

  removeManyGroupChatMembers(groupChatMemberIds: string[]) {
    this.store.dispatch(GroupChatMembersActions.removeManyGroupChatMembers({ groupChatMemberIds }))
  }

  addGroupChatMessage(groupChatMessage: GroupChatMessageModel) {
    this.store.dispatch(GroupChatMessagesActions.addGroupChatMessage({ groupChatMessage }))
  }

  addManyGroupChatMessages(groupChatMessages: GroupChatMessageModel[]) {
    this.store.dispatch(GroupChatMessagesActions.addManyGroupChatMessages({ groupChatMessages }))
  }

  updateGroupChatMessage(update: Update<GroupChatMessageModel>) {
    this.store.dispatch(GroupChatMessagesActions.updateGroupChatMessage({ update }))
  }

  updateManyGroupChatMessages(updates: Update<GroupChatMessageModel>[]) {
    this.store.dispatch(GroupChatMessagesActions.updateManyGroupChatMessages({ updates }))
  }

  removeGroupChatMessage(groupChatMessageId: number) {
    this.store.dispatch(GroupChatMessagesActions.removeGroupChatMessage({ groupChatMessageId }))
  }
}