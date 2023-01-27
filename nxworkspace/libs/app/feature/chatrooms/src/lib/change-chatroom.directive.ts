import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { BlockPanelComponent } from '@grid-layout/feature/blocks/block-panel'
import { StringsFacade } from '@project-id/data-access/facades'
import { BlockModel, BlockType, MessageTimeSortModel, PanelModel } from '@shared/data-access/models'
import { UserConversationComponent } from './conversation/user-conversation/user-conversation.component'
import { GroupChatConversationComponent } from './conversation/group-chat/group-chat-conversation.component'

@Directive({
  selector: '[appChangeChatRoom]',
  standalone: true,
})
export class ChangeChatRoomDirective implements OnDestroy {
  constructor(public viewContainerRef: ViewContainerRef) {}

  userConversationRef?: ComponentRef<UserConversationComponent>
  groupChatConversationRef?: ComponentRef<GroupChatConversationComponent>

  @Input() set chatRoom(chatRoom: MessageTimeSortModel) {
    const _viewContainerRef = this.viewContainerRef

    _viewContainerRef.clear()

    if (chatRoom.groupChat) {
      /*       const panelComponentRef =
        _viewContainerRef.createComponent<BlockPanelComponent>(BlockPanelComponent) */

      this.groupChatConversationRef =
        _viewContainerRef.createComponent<GroupChatConversationComponent>(
          GroupChatConversationComponent,
        )

      // panelComponentRef.instance.id = block.id

      this.groupChatConversationRef.instance.selectChatroom = chatRoom
      /*      console.log(block)
            console.log((block as any).stringId)
            if (block instanceof PanelModel) {


              // this.panelComponentRef.instance.panel = block
            }*/
      return
    }
    this.userConversationRef =
      _viewContainerRef.createComponent<UserConversationComponent>(UserConversationComponent)

    const recipient = chatRoom.message?.isUserSender
      ? chatRoom.message.recipientUserName
      : chatRoom.message?.senderUserName
    // e === user.userName ? chatRoomSelect.message.recipientUsername : chatRoomSelect.message.senderUsername

    // panelComponentRef.instance.id = block.id

    this.userConversationRef.instance.recipientImport = recipient
  }

  ngOnDestroy(): void {
    this.groupChatConversationRef?.destroy()
    this.userConversationRef?.destroy()
  }
}
