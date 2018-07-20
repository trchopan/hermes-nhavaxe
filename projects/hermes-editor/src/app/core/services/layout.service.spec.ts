import { TestBed, inject } from '@angular/core/testing';

import { LayoutService } from '@editor/app/core/services/layout.service';

describe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService]
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
