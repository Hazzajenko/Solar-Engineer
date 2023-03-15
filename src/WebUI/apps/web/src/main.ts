import { bootstrapApplication } from '@angular/platform-browser'
import { AppV2Component } from '@app/index'
import { mainTsProviders } from '@app/config'

/*bootstrapApplication(AppComponent, {
  providers: [...mainTsProviders],
}).catch((err) => console.error(err))*/

bootstrapApplication(AppV2Component, {
  providers: [...mainTsProviders],
}).catch((err) => console.error(err))
