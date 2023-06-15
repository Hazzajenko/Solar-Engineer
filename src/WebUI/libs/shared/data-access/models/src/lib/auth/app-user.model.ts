export type AppUserModel = {
	id: string
	displayName: string
	userName: string
	firstName: string
	lastName: string
	photoUrl: string
	email?: string
}

export type AppUserId = string & {
	readonly _type: 'appUserId'
}

/*export const GenerateUserData = (amount: number) =>
 generateMockData<AuthUserModel>(amount, {
 id: () => faker.datatype.uuid(),
 userName: () => faker.internet.userName(),
 displayName: () => `${faker.name.firstName()} ${faker.name.lastName().at(0)}`,
 firstName: () => faker.name.firstName(),
 lastName: () => faker.name.lastName(),
 photoUrl: () => faker.image.avatar(),
 })*/
