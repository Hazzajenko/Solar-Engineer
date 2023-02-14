import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LocalProjectComponent } from './local-project.component'

describe('ProjectsFeatureProjectIdComponent', () => {
  let component: LocalProjectComponent
  let fixture: ComponentFixture<LocalProjectComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalProjectComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LocalProjectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
