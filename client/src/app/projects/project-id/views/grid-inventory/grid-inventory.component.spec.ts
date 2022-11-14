import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GridInventoryComponent } from "./grid-inventory.component";

describe("GridInventoryComponent", () => {
	let component: GridInventoryComponent;
	let fixture: ComponentFixture<GridInventoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GridInventoryComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GridInventoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
