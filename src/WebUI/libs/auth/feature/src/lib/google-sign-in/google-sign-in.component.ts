import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

@Component({
	selector: 'app-google-sign-in',
	templateUrl: './google-sign-in.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	standalone: true,
})
export class GoogleSignInComponent implements OnInit {
	private http = inject(HttpClient)
	private router = inject(Router)

	ngOnInit(): void {
		const route = this.router.url
		console.log(route)
		this.http.get(`/auth${route}`, { withCredentials: true }).subscribe((res) => {
			console.log(res)
		})
	}
}
