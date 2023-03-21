import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { GenerateProjectMembersResponse } from '../models'

@Injectable({
  providedIn: 'root',
})
export class ProjectsAdminService {
  private http = inject(HttpClient)

  generateProjectMembers(projectId: string, numberOfMembers: number): Observable<GenerateProjectMembersResponse> {
    return this.http.post<GenerateProjectMembersResponse>(`/projects-api/admin/projects/generate/members`, {
      projectId,
      numberOfMembers,
    })
  }
}
