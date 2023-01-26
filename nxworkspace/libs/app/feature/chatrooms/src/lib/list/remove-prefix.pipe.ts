import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'removePrefix',
  standalone: true,
})
export class RemovePrefixPipe implements PipeTransform {
  transform(chatRoomName: string | undefined | null) {
    if (!chatRoomName) return

    return chatRoomName.slice(5, chatRoomName.length)
  }
}
