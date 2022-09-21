import { TestBed } from '@angular/core/testing';

import { ProjectListInteractionService } from './project-list-interaction.service';

describe('ProjectListInteractionService', () => {
  let service: ProjectListInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectListInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
