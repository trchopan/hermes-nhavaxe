import { TestBed } from '@angular/core/testing';

import { SpecialsService } from './specials.service';

describe('SpecialsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecialsService = TestBed.get(SpecialsService);
    expect(service).toBeTruthy();
  });
});
