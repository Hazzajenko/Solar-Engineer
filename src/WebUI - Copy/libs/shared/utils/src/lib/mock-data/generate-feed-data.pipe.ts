import { Pipe, PipeTransform } from '@angular/core'
import { HomeFeedModel } from '@shared/data-access/models'
import { generateMockData } from './generate-mock-data'
import { faker } from '@faker-js/faker'
import { generateDisplayName } from '@shared/utils'

@Pipe({
  name: 'generateFeedData',
  standalone: true,
})
export class GenerateFeedDataPipe implements PipeTransform {
  transform(amount: number) {
    return generateMockData<HomeFeedModel>(amount, {
      userId: () => faker.datatype.uuid(),
      userDisplayName: () => generateDisplayName(),
      userPhotoUrl: () => `https://robohash.org/${faker.internet.userName()}.png?size=40x40`,
      eventTime: () => faker.date.past(0),
      eventType: () => faker.helpers.arrayElement(['comment', 'like', 'follow']),
      eventDescription: () => faker.lorem.sentence(),
    })
  }
}
