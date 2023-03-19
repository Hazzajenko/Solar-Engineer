import { bootstrapApplication } from '@angular/platform-browser'
// import { AppV2Component } from '@app/index'
import { mainTsProviders } from '@app/config'
import { AppComponent } from '@app/app-component'

/*bootstrapApplication(AppComponent, {
 providers: [...mainTsProviders],
 }).catch((err) => console.error(err))*/

bootstrapApplication(AppComponent, {
  providers: [...mainTsProviders],
}).catch((err) => console.error(err))
