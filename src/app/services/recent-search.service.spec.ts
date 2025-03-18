import { TestBed } from '@angular/core/testing';

import { RecentSearchService } from './recent-search.service';

describe('RecentSearchService', () => {
  let service: RecentSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
