import { generateMockData } from '@shared/utils'
import { faker } from '@faker-js/faker'

export interface AuthUserModel {
  id: string
  displayName: string
  userName: string
  firstName: string
  lastName: string
  photoUrl: string
}

export const GenerateUserData = (amount: number) =>
  generateMockData<AuthUserModel>(amount, {
    id: () => faker.datatype.uuid(),
    userName: () => faker.internet.userName(),
    displayName: () => `${faker.name.firstName()} ${faker.name.lastName().at(0)}`,
    firstName: () => faker.name.firstName(),
    lastName: () => faker.name.lastName(),
    photoUrl: () => faker.image.avatar(),
  })
