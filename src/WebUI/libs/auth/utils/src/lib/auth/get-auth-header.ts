import { HttpHeaders } from '@angular/common/http'

export const getAuthorizationHeader = (token: string) => {
	return new HttpHeaders().set('Authorization', `Bearer ${token}`)
}
