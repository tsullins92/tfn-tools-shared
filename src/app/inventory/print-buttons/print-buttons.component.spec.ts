import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintButtonsComponent } from './print-buttons.component';

describe('PrintButtonsComponent', () => {
  let component: PrintButtonsComponent;
  let fixture: ComponentFixture<PrintButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
