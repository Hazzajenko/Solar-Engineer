/*
 import { Component, inject } from '@angular/core'
 import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
 import { SupabaseService } from '@auth/data-access'

 @Component({
 selector: 'app-supabase-auth',
 standalone: true,
 template: `
 <div class="row flex-center flex">
 <div class="col-6 form-widget" aria-live="polite">
 <h1 class="header">Supabase + Angular</h1>
 <p class="description">Sign in via magic link with your email below</p>
 <form [formGroup]="signInForm" (ngSubmit)="onSubmit()" class="form-widget">
 <div>
 <label for="email">Email</label>
 <input
 id="email"
 formControlName="email"
 class="inputField"
 type="email"
 placeholder="Your email"
 />
 </div>
 <div>
 <button type="submit" class="button block" [disabled]="loading">
 {{ loading ? 'Loading' : 'Send magic link' }}
 </button>
 </div>
 </form>
 <button (click)="onSubmit()">SIGN IN WITH GOOGLE</button>
 </div>
 </div>
 `,
 styles: [],
 imports: [ReactiveFormsModule],
 })
 export class SupabaseAuthComponent {
 private _supabase = inject(SupabaseService)
 private _formBuilder = inject(FormBuilder)

 loading = false

 signInForm = this._formBuilder.group({
 email: '',
 })

 /!*	constructor(
 // private readonly supabase: SupabaseService,
 // private readonly formBuilder: FormBuilder,
 ) {}*!/

 async onSubmit(): Promise<void> {
 try {
 this.loading = true
 const email = this.signInForm.value.email as string
 const { error } = await this._supabase.signInWithGoogle()
 // const { error } = await this._supabase.signIn(email)
 if (error) throw error
 alert('Check your email for the login link!')
 } catch (error) {
 if (error instanceof Error) {
 alert(error.message)
 }
 } finally {
 this.signInForm.reset()
 this.loading = false
 }
 }
 }
 */
