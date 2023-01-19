import { bootstrapApplication } from '@angular/platform-browser'
import { mainTsProviders } from '@app/config'

import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, {
  providers: [
    ...mainTsProviders,
  ],
}).catch((err) => console.error(err))
