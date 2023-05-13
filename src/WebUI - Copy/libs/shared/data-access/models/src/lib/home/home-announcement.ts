import { faker } from '@faker-js/faker'
import { generateMockData } from '@shared/utils'
import { SafeHtml } from '@angular/platform-browser'

export interface HomeAnnouncementModel {
  id: string
  title: string
  description: SafeHtml
  length?: number
  link: string
  linkText: string
  image: string
  imageAlt: string
  announcementTime: Date
}

export const GenerateHomeAnnouncementData = (amount: number) =>
  generateMockData<HomeAnnouncementModel>(amount, {
    id: () => faker.datatype.uuid(),
    title: () => faker.lorem.sentence(),
    description: () => faker.lorem.paragraph(),
    length: () => 0,
    link: () => faker.internet.url(),
    linkText: () => faker.lorem.word(),
    image: () => faker.image.imageUrl(),
    imageAlt: () => faker.lorem.word(),
    announcementTime: () => faker.date.past(),
  })
