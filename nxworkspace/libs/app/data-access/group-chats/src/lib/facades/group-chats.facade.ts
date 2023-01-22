import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { GroupChatMembersSelectors, GroupChatMessagesSelectors, GroupChatsSelectors } from '../store'


@Injectable({
  providedIn: 'root',
})
export class GroupChatsFacade {
  private store = inject(Store)

  groupChats$ = this.store.select(GroupChatsSelectors.selectAllGroupChats)
  error$ = this.store.select(GroupChatsSelectors.selectGroupChatsError)
  loaded$ = this.store.select(GroupChatsSelectors.selectGroupChatsLoaded)

  members$ = this.store.select(GroupChatMembersSelectors.selectAllGroupChatMembers)
  membersError$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersError)
  membersLoaded$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersLoaded)

  messages$ = this.store.select(GroupChatMessagesSelectors.selectAllGroupChatMessages)
  messagesError$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesError)
  messagesLoaded$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesLoaded)

  get groupChats() {
    return firstValueFrom(this.groupChats$)
  }

  get members() {
    return firstValueFrom(this.members$)
  }

  get messages() {
    return firstValueFrom(this.messages$)
  }
}
