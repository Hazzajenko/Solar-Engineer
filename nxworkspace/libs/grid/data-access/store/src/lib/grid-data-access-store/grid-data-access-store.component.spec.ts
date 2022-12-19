import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GridDataAccessStoreComponent } from './grid-data-access-store.component'

describe('GridDataAccessStoreComponent', () => {
  let component: GridDataAccessStoreComponent
  let fixture: ComponentFixture<GridDataAccessStoreComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDataAccessStoreComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(GridDataAccessStoreComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
