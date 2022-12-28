import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectIdFeatureToolbarV2Component } from './project-id-feature-toolbar-v2.component'

describe('ProjectIdFeatureToolbarV2Component', () => {
  let component: ProjectIdFeatureToolbarV2Component
  let fixture: ComponentFixture<ProjectIdFeatureToolbarV2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectIdFeatureToolbarV2Component],
    }).compileComponents()

    fixture = TestBed.createComponent(ProjectIdFeatureToolbarV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
