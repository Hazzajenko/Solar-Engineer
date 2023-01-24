import {inject, Injectable} from '@angular/core'
import {MessagesStoreService} from "@app/messages";
import {GroupChatsStoreService} from "@app/data-access/group-chats";
import {combineLatest, map} from "rxjs";
import {MessageTimeSortModel} from "@shared/data-access/models";

@Injectable({
  providedIn: 'root',
})
export class ChatroomsService {
  private messagesStore = inject(MessagesStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)

  getCombinedUserMessagesAndGroupChats$() {
    return combineLatest([
      this.messagesStore.select.firstMessageOfEveryConversation$(),
      this.groupChatsStore.select.groupChatsWithLatestMessage$
    ]).pipe(
      map(([messages, groupChats]) => {
        // const latestGroupChatMessages = groupChats.map(groupChat => groupChat.latestSentMessage)
        const latestGroupChatMessages = groupChats.map(groupChat => {
          return {
            isGroup: true,
            latestSentMessageTime: groupChat.latestSentMessageTime,
            groupChat
          } as MessageTimeSortModel
        })

        const latestUserMessages = messages?.map(message => {
          return {
            isGroup: false,
            latestSentMessageTime: message.messageSentTime,
            message
          } as MessageTimeSortModel
        })

        const combined = latestGroupChatMessages.concat(latestUserMessages ? latestUserMessages : [])
        return combined.sort((a: MessageTimeSortModel, b: MessageTimeSortModel) =>
          new Date(b.latestSentMessageTime).getTime() - new Date(a.latestSentMessageTime).getTime()
        )
      })
    )
  }
}
