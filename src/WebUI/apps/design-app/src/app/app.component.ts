import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

// import { invoke } from '@tauri-apps/api/tauri'

@Component({
	standalone: true,
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [],
	imports: [RouterOutlet],
})
export class AppComponent {
	title = 'design-app'

	constructor() {
		/*		invoke('greet', { name: 'World' }).then((text) => {
		 console.log(text)
		 // this.title = text;
		 })*/
	}
}
