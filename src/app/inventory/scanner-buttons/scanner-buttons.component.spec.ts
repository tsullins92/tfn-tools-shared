import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerButtonsComponent } from './scanner-buttons.component';

describe('ScannerButtonsComponent', () => {
  let component: ScannerButtonsComponent;
  let fixture: ComponentFixture<ScannerButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
