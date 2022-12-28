import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectIdComponent } from './local-project.component'

describe('ProjectsFeatureProjectIdComponent', () => {
  let component: ProjectIdComponent
  let fixture: ComponentFixture<ProjectIdComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectIdComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectIdComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
