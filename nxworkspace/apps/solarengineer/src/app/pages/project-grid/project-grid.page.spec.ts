import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectGridPage } from './project-grid.page'

describe('ProjectGridPage', () => {
  let component: ProjectGridPage
  let fixture: ComponentFixture<ProjectGridPage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectGridPage],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectGridPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
