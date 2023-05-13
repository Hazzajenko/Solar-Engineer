import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { webAppProviders } from '@app/config'

bootstrapApplication(AppComponent, {
	providers: [...webAppProviders],
}).catch((err) => console.error(err))
