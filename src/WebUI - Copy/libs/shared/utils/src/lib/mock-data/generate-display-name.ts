import { faker } from '@faker-js/faker'
import { randomIntFromInterval } from '../random-number'
import { generateProfilePicture } from '../profile-picture'
import { AuthUserModel } from '@shared/data-access/models'

export function generateDisplayName(): string {
  return `${faker.name.firstName()} ${faker.name.lastName().at(0)}`
}

export function generateUserModel(): AuthUserModel {
  const gender = randomIntFromInterval(0, 1) === 0 ? 'male' : 'female'
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)
  const userName = faker.internet.userName(firstName, lastName)
  const firstNameInitial = firstName.at(0)
  const lastNameInitial = lastName.at(0)
  const photoUrl = generateProfilePicture(`${firstNameInitial}${lastNameInitial}`, 30)
  const displayName = `${firstName} ${lastNameInitial}`

  return {
    id: faker.datatype.uuid(),
    userName: userName,
    displayName: displayName,
    firstName: firstName,
    lastName: lastName,
    photoUrl: photoUrl,
  }
}

export function generateManyUserModels(amount: number): AuthUserModel[] {
  const models: AuthUserModel[] = []
  for (let i = 0; i < amount; i++) {
    models.push(generateUserModel())
  }
  return models
}