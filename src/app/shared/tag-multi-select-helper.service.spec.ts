import { TestBed } from '@angular/core/testing';

import { TagMultiSelectHelperService } from './tag-multi-select-helper.service';

describe('TagMultiSelectHelperService', () => {
  let service: TagMultiSelectHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagMultiSelectHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
