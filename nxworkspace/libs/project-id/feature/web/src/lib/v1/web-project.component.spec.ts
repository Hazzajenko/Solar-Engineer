import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WebProjectComponent } from 'libs/project-id/feature/web/src/lib/v1/web-project.component'

describe('ProjectsFeatureProjectIdComponent', () => {
  let component: WebProjectComponent
  let fixture: ComponentFixture<WebProjectComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebProjectComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WebProjectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
