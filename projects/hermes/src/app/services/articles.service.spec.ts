import { TestBed, inject } from '@angular/core/testing';

import { ArticlesService } from '@app/app/services/articles.service';

describe('ArticlesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticlesService]
    });
  });

  it('should be created', inject([ArticlesService], (service: ArticlesService) => {
    expect(service).toBeTruthy();
  }));
});
