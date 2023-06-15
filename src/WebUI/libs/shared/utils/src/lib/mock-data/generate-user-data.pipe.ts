import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'generateUserData',
	standalone: true,
})
export class GenerateUserDataPipe implements PipeTransform {
	transform(value: number, imgSize?: number) {
		if (!imgSize) {
			imgSize = 30
		}
		// const userName = faker.internet.userName()
		// const photoUrl = `https://robohash.org/${userName}.png?size=30x30`
		/*		return generateMockData<AppUserModel>(value, {
		 id: () => faker.datatype.uuid(),
		 userName: () => faker.internet.userName(),
		 displayName: () => `${faker.name.firstName()} ${faker.name.lastName().at(0)}`,
		 firstName: () => faker.name.firstName(),
		 lastName: () => faker.name.lastName(),
		 photoUrl: () =>
		 `https://robohash.org/${faker.internet.userName()}.png?size=${imgSize}x${imgSize}`,
		 email: () => faker.internet.email(),
		 })*/
		// return GenerateUserData(value)
	}
}
