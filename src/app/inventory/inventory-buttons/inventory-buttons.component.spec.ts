import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryButtonsComponent } from './inventory-buttons.component';

describe('InventoryButtonsComponent', () => {
  let component: InventoryButtonsComponent;
  let fixture: ComponentFixture<InventoryButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
