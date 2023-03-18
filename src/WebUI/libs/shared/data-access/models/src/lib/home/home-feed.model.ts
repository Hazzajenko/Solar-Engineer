import { faker } from '@faker-js/faker'
import { generateDisplayName, generateMockData } from '@shared/utils'

export interface HomeFeedModel {
  userId: string
  userDisplayName: string
  userPhotoUrl: string
  eventTime: Date
  eventType: string
  eventDescription: string
}

export const GenerateHomeFeedData = (amount: number) =>
  generateMockData<HomeFeedModel>(amount, {
    userId: () => faker.datatype.uuid(),
    userDisplayName: () => generateDisplayName(),
    /*    userPhotoUrl: async () =>
          await fetch('/users-api/dp-image', {
            method: 'POST',
            body: JSON.stringify({
              initials: `${faker.name.firstName().at(0)}${faker.name.lastName().at(0)}`,
            }),
          }).then((res) =>
            res
              .json()
              // .then((url) => console.log(url))
              .then((data) => data.imageUrl as string),
          ),*/

    // generateProfilePicture(`${faker.name.firstName().at(0)}${faker.name.lastName().at(0)}`, 30),
    userPhotoUrl: () => faker.image.avatar(),
    eventTime: () => faker.date.past(0),
    eventType: () => faker.helpers.arrayElement(['comment', 'like', 'follow']),
    eventDescription: () => faker.lorem.sentence(),
  })
