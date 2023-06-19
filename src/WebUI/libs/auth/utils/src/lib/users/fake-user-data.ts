import { WebUserModel } from '@auth/shared'
import { faker } from '@faker-js/faker'
import { newGuid } from '@shared/utils'

export const generateMockData = <T>(count: number, generator: () => T): T[] => {
	return Array.from({ length: count }, generator)
}

export const GenerateUserData = (count: number): WebUserModel[] => {
	return generateMockData<WebUserModel>(count, () => {
		return {
			id: '1',
			userName: 'user1',
			displayName: 'User 1',
			photoUrl: 'https://robohash.org/user1.png?size=30x30',
			isFriend: false,
			becameFriendsTime: new Date().toISOString(),
			isOnline: false,
			lastActiveTime: new Date().toISOString(),
			registeredAtTime: new Date().toISOString(),
		}
	})
}

export const GenerateFriendData = (count: number): WebUserModel[] => {
	return generateMockData<WebUserModel>(count, () => {
		return {
			id: newGuid(),
			userName: faker.internet.userName(),
			displayName: faker.name.firstName() + ' ' + faker.name.lastName(),
			photoUrl: faker.image.avatar(), // photoUrl: 'https://robohash.org/user1.png?size=30x30',
			isFriend: true,
			becameFriendsTime: faker.date.recent(5).toISOString(),
			isOnline: true,
			lastActiveTime: faker.date.recent(1).toISOString(),
			registeredAtTime: faker.date.past().toISOString(),
		}
	})
}
