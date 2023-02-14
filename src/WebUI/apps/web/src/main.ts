import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from '@app/index'
import { mainTsProviders } from '@app/config'

bootstrapApplication(AppComponent, {
  providers: [...mainTsProviders],
}).catch((err) => console.error(err))
