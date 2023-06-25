import { GROUP_CHATS_FEATURE_KEY, groupChatsAdapter, GroupChatsState } from './group-chats.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { GroupChatModel } from '@auth/shared'

export const selectGroupChatsState = createFeatureSelector<GroupChatsState>(GROUP_CHATS_FEATURE_KEY)

const { selectAll, selectEntities } = groupChatsAdapter.getSelectors()

export const selectAllGroupChats = createSelector(selectGroupChatsState, (state: GroupChatsState) =>
	selectAll(state),
)

export const selectGroupChatsEntities = createSelector(
	selectGroupChatsState,
	(state: GroupChatsState) => selectEntities(state),
)

export const selectGroupChatById = (props: { id: string }) =>
	createSelector(
		selectGroupChatsEntities,
		(groupChats: Dictionary<GroupChatModel>) => groupChats[props.id],
	)

export const selectGroupChatsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllGroupChats, (groupChats: GroupChatModel[]) =>
		groupChats.filter((groupChat) => props.ids.includes(groupChat.id)),
	)

/*
 export const selectAllFriendsGroupedByFirstLetter = createSelector(
 selectAllGroupChats,
 (groupChats: GroupChatModel[]) => {
 const firstLetters = group-chats.map((groupChat) => groupChat.displayName[0])
 const uniqueFirstLetters = [...new Set(firstLetters)]
 const grouped = uniqueFirstLetters.reduce(
 (acc, firstLetter) => {
 const groupChatsWithFirstLetter = group-chats.filter(
 (groupChat) => groupChat.displayName[0] === firstLetter,
 )
 return {
 ...acc,
 [firstLetter]: groupChatsWithFirstLetter,
 }
 },
 {} as {
 [key: string]: GroupChatModel[]
 },
 )
 const entries = Object.entries(grouped)
 return entries.map(([firstLetter, groupChats]) => {
 return {
 firstLetter,
 groupChats,
 }
 })
 },
 )
 */
