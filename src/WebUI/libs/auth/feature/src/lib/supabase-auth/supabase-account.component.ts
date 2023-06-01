/*
 import { Component, inject, Input } from '@angular/core'
 import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
 import { Profile, SupabaseService } from '@auth/data-access'
 import { AuthSession } from '@supabase/supabase-js'

 @Component({
 selector: 'app-supabase-account',
 standalone: true,
 template: `
 <form [formGroup]="updateProfileForm" (ngSubmit)="updateProfile()" class="form-widget">
 <div>
 <label for="email">Email</label>
 <input id="email" type="text" [value]="session.user.email" disabled />
 </div>
 <div>
 <label for="username">Name</label>
 <input formControlName="username" id="username" type="text" />
 </div>
 <div>
 <label for="website">Website</label>
 <input formControlName="website" id="website" type="url" />
 </div>

 <div>
 <button type="submit" class="button primary block" [disabled]="loading">
 {{ loading ? 'Loading ...' : 'Update' }}
 </button>
 </div>

 <div>
 <button class="button block" (click)="signOut()">Sign Out</button>
 </div>
 </form>
 `,
 styles: [],
 imports: [ReactiveFormsModule],
 })
 export class SupabaseAccountComponent {
 private _supabase = inject(SupabaseService)
 private _formBuilder = inject(FormBuilder)
 loading = false
 profile!: Profile

 @Input() session!: AuthSession

 updateProfileForm = this._formBuilder.group({
 username: '',
 website: '',
 avatar_url: '',
 })

 // constructor(private readonly _supabase: SupabaseService, private _formBuilder: FormBuilder) {}

 async ngOnInit(): Promise<void> {
 await this.getProfile()

 const { username, website, avatar_url } = this.profile
 this.updateProfileForm.patchValue({
 username,
 website,
 avatar_url,
 })
 }

 async getProfile() {
 try {
 this.loading = true
 const { user } = this.session
 const { data: profile, error, status } = await this._supabase.profile(user)
 console.log('profile', profile)
 if (error && status !== 406) {
 throw error
 }

 if (profile) {
 this.profile = profile
 }
 } catch (error) {
 if (error instanceof Error) {
 alert(error.message)
 }
 } finally {
 this.loading = false
 }
 }

 async updateProfile(): Promise<void> {
 try {
 this.loading = true
 const { user } = this.session

 const username = this.updateProfileForm.value.username as string
 const website = this.updateProfileForm.value.website as string
 const avatar_url = this.updateProfileForm.value.avatar_url as string

 const { error } = await this._supabase.updateProfile({
 id: user.id,
 username,
 website,
 avatar_url,
 })
 if (error) throw error
 } catch (error) {
 if (error instanceof Error) {
 alert(error.message)
 }
 } finally {
 this.loading = false
 }
 }

 async signOut() {
 await this._supabase.signOut()
 }
 }
 */
