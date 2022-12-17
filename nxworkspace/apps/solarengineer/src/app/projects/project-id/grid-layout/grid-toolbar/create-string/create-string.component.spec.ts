import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CreateStringComponent } from './create-string.component'

describe('CreateStringComponent', () => {
  let component: CreateStringComponent
  let fixture: ComponentFixture<CreateStringComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateStringComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CreateStringComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
