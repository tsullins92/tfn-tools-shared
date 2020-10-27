import { TestBed } from '@angular/core/testing';

import { PrintersService } from './printers.service';

describe('PrintersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintersService = TestBed.get(PrintersService);
    expect(service).toBeTruthy();
  });
});
