import { BlogPostModel } from '@shared/data-access/models'
import { of, startWith } from 'rxjs'

const contentV1 =
  'Hello everyone!\n\n' +
  "We're excited to announce the release of Solarengineer v1.0.1! This new version includes several improvements and bug fixes based on your feedback.\n\n" +
  'Here are some of the key changes in this release:\n' +
  '- Added support for customizing the color scheme of the app\n' +
  '- Improved performance when loading large data sets\n' +
  '- Fixed a bug that caused the app to crash when switching between tabs\n' +
  '- Improved accessibility of the app for users with disabilities\n\n' +
  "We've also made some smaller improvements to the user interface and added some new features to make the app even more useful for solar energy professionals.\n\n" +
  "Thank you to everyone who provided feedback and helped us improve the app. We're committed to making Solarengineer the best tool for solar energy professionals, and we'll continue to listen to your feedback and make improvements in future releases.\n\n" +
  "If you haven't tried Solarengineer yet, now is a great time to give it a try. You can download the latest version from our website or app store.\n\n" +
  "As always, if you have any questions or feedback, please don't hesitate to reach out to us. We love hearing from our users!\n\n" +
  'Best regards,\n\n' +
  'The Solarengineer Team'

const contentV2 =
  'Hello everyone!\n\n' +
  "We're excited to announce the release of Solarengineer v1.0.1! This new version includes several improvements and bug fixes based on your feedback.\n\n" +
  'Here are some of the key changes in this release:\n' +
  '- Added support for customizing the color scheme of the app\n' +
  '- Improved performance when loading large data sets\n' +
  '- Fixed a bug that caused the app to crash when switching between tabs\n' +
  '- Improved accessibility of the app for users with disabilities\n' +
  '- Updated the user interface with a fresh, modern design\n' +
  '- Added new visualization tools to help analyze solar panel performance\n' +
  '- Implemented automatic system backups to prevent data loss\n\n' +
  "Thank you to everyone who provided feedback and helped us improve the app. We're committed to making Solarengineer the best tool for solar energy professionals, and we'll continue to listen to your feedback and make improvements in future releases.\n\n" +
  "If you haven't tried Solarengineer yet, now is a great time to give it a try. You can download the latest version from our website or app store.\n\n" +
  "As always, if you have any questions or feedback, please don't hesitate to reach out to us. We love hearing from our users!\n\n" +
  'Best regards,\n\n' +
  'The Solarengineer Team'

export function newReleasePost(): BlogPostModel {
  return {
    id: '1',
    title: 'Solarengineer v1.0.1!',
    description: 'Improvements and bug fixes',
    content: contentV2,
    authorId: '1',
    authorDisplayName: 'Harry Jenkins',
    authorPhotoUrl:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAKdJREFUSInt1jEKAyEUBNDZmEawFRsLQRAE738RL2BjYS9YWCRdmphkV2K2yJ/S7/BAQdxijDeckMsZKMEEE/wnsPcexpjhzDkHa+1wFkKA1noeXhWCf5brnk1CCIQQhrPW2jq41oqU0tO6c24KBRYfde99LWyMgff+UOcrcGsNjDEopQDg8XCUUl52dt3xp5RSwDmHlBJSSgBAzvltZ6PPHsEEEzybO5C1I0uIQ10sAAAAAElFTkSuQmCC',
    publishedTime: new Date(),
    updatedTime: new Date(),
    tags: ['tag1', 'tag2'],
    comments: [],
  }
}

export const newReleasePost$ = of(newReleasePost()).pipe(startWith(newReleasePost()))

export const newReleasePostArray$ = of([newReleasePost()]).pipe(startWith([newReleasePost()]))
