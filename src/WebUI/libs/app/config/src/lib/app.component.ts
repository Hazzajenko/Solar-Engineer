import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { checkIfIsAuthorizeQuery } from './is-authorize-query.selector'
import { HttpClient } from '@angular/common/http'

@Component({
	standalone: true,
	imports: [RouterOutlet],
	selector: 'app-root',
	template: `
		<div class="h-full min-h-full w-full min-w-full bg-slate-100">
			<router-outlet />
		</div>
	`,
	styles: [''],
})
export class AppComponent {
	private _http = inject(HttpClient)
	title = 'solar-engineer'
	// isAuthorizeQuery = provideIsAuthorizeQuery()
	isAuthorizeQuery = checkIfIsAuthorizeQuery()

	// ngOnInit() {
	/*	const query = this.isAuthorizeQuery()
	 console.log(query)

	 // if (query) {
	 if (query === 'true') {
	 this._http
	 .post<AuthorizeResponse>('/auth/auth/authorize', {}, { withCredentials: true })
	 .subscribe((res) => {
	 console.log(res)
	 })
	 // this._http.get('/auth/user').subscribe(console.log)
	 }*/
	// }
}
