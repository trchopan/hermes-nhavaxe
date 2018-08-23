import { TestBed, inject } from '@angular/core/testing';

import { PriceListService } from './price-list.service';

describe('PriceListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceListService]
    });
  });

  it('should be created', inject([PriceListService], (service: PriceListService) => {
    expect(service).toBeTruthy();
  }));
});
