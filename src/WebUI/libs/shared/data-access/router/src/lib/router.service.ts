import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Logger } from 'tslog'
import { ProjectModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router)
  logger = new Logger({ name: this.constructor.name })

  async navigateToHome() {
    return await this.router.navigate(['']).catch((err) => this.logger.error(err))
  }

  async navigateToLogin() {
    return await this.router.navigate(['login']).catch((err) => this.logger.error(err))
  }

  async navigateToRegister() {
    return await this.router.navigate(['register']).catch((err) => this.logger.error(err))
  }

  async navigateToProfile() {
    // not yet implemented
    this.logger.error('navigateToProfile not yet implemented')
    return false
    // return await this.router.navigate(['profile']).catch((err) => this.logger.error(err))
  }

  async navigateToSettings() {
    // not yet implemented
    this.logger.error('navigateToSettings not yet implemented')
    return false
    // return await this.router.navigate(['settings']).catch((err) => this.logger.error(err))
  }

  async navigateToProjectsHome() {
    return await this.router.navigate(['projects']).catch((err) => this.logger.error(err))
  }

  async navigateToProject(userName: string, projectName: string) {
    return await this.router.navigate([userName, projectName]).catch((err) => this.logger.error(err))
  }

  async navigateToProjectsGrid(userName: string, project: ProjectModel) {
    return await this.router.navigate([userName, project.name, 'grid'])
                     .catch((err) => this.logger.error(err))
  }

  async navigateToProjectsInvite(userName: string, project: ProjectModel) {
    return await this.router.navigate([userName, project.name, 'invite'])
                     .catch((err) => this.logger.error(err))
  }

}