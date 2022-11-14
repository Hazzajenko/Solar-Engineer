import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	form!: FormGroup;

	type: "login" | "signup" | "reset" = "signup";
	loading = false;
	isLogin = true;
	serverMessage?: string;
	isPasswordReset = false;

	constructor(private auth: AuthService, private fb: FormBuilder) {}

	get email() {
		return this.form?.get("email");
	}

	get password() {
		return this.form?.get("password");
	}

	get passwordConfirm() {
		return this.form?.get("passwordConfirm");
	}

	get passwordDoesMatch() {
		if (this.type !== "signup") {
			return true;
		} else {
			return this.password?.value === this.passwordConfirm?.value;
		}
	}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.minLength(6), Validators.required]],
			passwordConfirm: ["", []],
		});
	}

	async onSubmit() {
		this.loading = true;

		const email = this.email?.value;
		const password = this.password?.value;

		try {
			if (this.isLogin) {
				await this.auth.signIn({ email, password });
			}
			/*      if (this.isSignup) {
              await this.afAuth.createUserWithEmailAndPassword(email, password);
            }
            if (this.isPasswordReset) {
              await this.afAuth.sendPasswordResetEmail(email);
              this.serverMessage = 'Check your email';
            }*/
		} catch (err) {
			this.serverMessage = `${err}`;
		}

		this.loading = false;
	}
}
