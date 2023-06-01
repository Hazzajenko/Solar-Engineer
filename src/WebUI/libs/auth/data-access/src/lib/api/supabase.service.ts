/*
 import { Injectable } from '@angular/core'

 export interface Profile {
 id?: string
 username: string
 website: string
 avatar_url: string
 }

 @Injectable({
 providedIn: 'root',
 })
 export class SupabaseService {
 /!*private _supabase: SupabaseClient
 _session: AuthSession | null = null

 constructor() {
 this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
 }

 get session() {
 this._supabase.auth.getSession().then(({ data }) => {
 this._session = data.session
 })
 return this._session
 }

 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
 // @ts-ignore
 profile(user: User) {
 return this._supabase
 .from('profiles')
 .select(`username, website, avatar_url`)
 .eq('id', user.id)
 .single()
 }

 async getProfile() {
 try {
 // this.loading = true
 const session = this.session
 if (!session) {
 throw new Error('Session not found')
 }
 const { user } = session
 const { data: profile, error, status } = await this.profile(user)
 console.log('profile', profile)
 if (error && status !== 406) {
 throw error
 }

 if (profile) {
 return profile
 // this.profile = profile
 }
 return null
 } catch (error) {
 if (error instanceof Error) {
 alert(error.message)
 }
 } finally {
 // return null
 // this.loading = false
 }
 return null
 }

 authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
 return this._supabase.auth.onAuthStateChange(callback)
 }

 signIn(email: string) {
 return this._supabase.auth.signInWithOtp({ email })
 }

 async signInWithGoogle() {
 const { data, error } = await this._supabase.auth.signInWithOAuth({
 provider: 'google',
 })
 console.log(data, error)
 return { data, error }
 }

 /!*	async function signout() {
 const { error } = await supabase.auth.signOut()
 }*!/

 signOut() {
 return this._supabase.auth.signOut()
 }

 updateProfile(profile: Profile) {
 const update = {
 ...profile,
 updated_at: new Date(),
 }

 return this._supabase.from('profiles').upsert(update)
 }

 downLoadImage(path: string) {
 return this._supabase.storage.from('avatars').download(path)
 }

 uploadAvatar(filePath: string, file: File) {
 return this._supabase.storage.from('avatars').upload(filePath, file)
 }*!/
 }
 */
