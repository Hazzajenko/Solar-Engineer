import {
	AsyncPipe,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	signal,
	ViewChild,
	ViewChildren,
} from '@angular/core'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { ShowSvgComponent, ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { increaseScaleAndOpacity } from '@shared/animations'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { IsTypeOfPanelPipe } from '@entities/utils'
import { FormBuilder } from '@angular/forms'
import { injectAuthStore } from '@auth/data-access'

@Component({
	selector: 'dialog-profile-settings',
	templateUrl: 'profile-settings-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		LetDirective,
		DialogBackdropTemplateComponent,
		NgStyle,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		CdkDrag,
		CdkDragHandle,
		IsTypeOfPanelPipe,
		RadiansToDegreesPipe,
		TruncatePipe,
		NgTemplateOutlet,
		ToggleSvgNoStylesComponent,
		NgOptimizedImage,
	],
	animations: [increaseScaleAndOpacity],
})
export class ProfileSettingsDialogComponent implements AfterViewInit {
	// private _supabase = inject(SupabaseService)
	private _uiStore = inject(UiStoreService)
	private _auth = injectAuthStore()
	private _formBuilder = inject(FormBuilder)
	user = this._auth.select.user
	loading = false
	/*	profile!: Profile

	 // @Input() session!: AuthSession

	 updateProfileForm = this._formBuilder.group({
	 username: '',
	 website: '',
	 avatar_url: '',
	 })*/
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>
	@ViewChildren('accordion') accordions!: ElementRef<HTMLDivElement>[]
	openedAccordions = signal(new Map<string, boolean>())

	/*	get user(): AuthUserModel | undefined {
	 return this._user()
	 }*/

	/*
	 async ngOnInit() {
	 const profile = await this._supabase.getProfile()
	 console.log('profile', profile)
	 if (profile) {
	 this.profile = profile
	 }
	 }
	 */

	ngAfterViewInit() {
		if (this.accordions) {
			console.log('accordions', this.accordions)
			this.accordions.forEach((accordion) => {
				this.openedAccordions.mutate((value) => value.set(accordion.nativeElement.id, true))
			})
		}
	}

	/*	async getProfile() {
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
	 }*/

	/*	async updateProfile(): Promise<void> {
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
	 }*/

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}

	toggleAccordionView(accordionName: string) {
		this.openedAccordions.mutate((value) => value.set(accordionName, !value.get(accordionName)))
	}

	addToMap(accordionName: string) {
		this.openedAccordions.mutate((value) => value.set(accordionName, true))
	}
}
