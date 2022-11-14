import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = "solarengineer";

	constructor(private auth: AuthService) {}

	signIn() {
		this.auth
			.signIn({ email: "test@email.com", password: "password" })
			.then((res) => console.log(res));
	}

	ngOnInit(): void {
		this.auth
			.signIn({ email: "test@email.com", password: "password" })
			.then((res) => console.log(res));
	}
}
