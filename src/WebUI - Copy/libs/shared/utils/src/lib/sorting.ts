export function sortByMessageSentTime<T>(
  data: { messageSentTime: string }[],
  dir?: 'asc' | 'desc',
): T[] {
  if (!dir || dir === 'asc') {
    return data.sort((a: { messageSentTime: string }, b: { messageSentTime: string }) => {
      return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
    }) as T[]
  }
  return data.sort((a: { messageSentTime: string }, b: { messageSentTime: string }) => {
    return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
  }) as T[]
}

export function byMessageSentTime(
  a: { messageSentTime: string },
  b: { messageSentTime: string },
  dir?: 'asc' | 'desc',
) {
  if (!dir || dir === 'asc') {
    return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
  }
  return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
}

/*
((a: GroupChatMessageMemberModel, b: GroupChatMessageMemberModel) => {
  return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
})*/
