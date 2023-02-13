export const MESSAGE_FROM = ['Unknown', 'OtherUser', 'CurrentUser', 'Server'] as const

// export type MessageFrom = typeof MESSAGE_FROM[number]

export enum MessageFrom {
  Unknown,
  OtherUser,
  CurrentUser,
  Server,
}

// const hi: MessageFrom2 = 1
