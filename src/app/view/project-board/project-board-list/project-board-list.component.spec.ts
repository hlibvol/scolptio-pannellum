import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBoardListComponent } from './project-board-list.component';

describe('ProjectBoardListComponent', () => {
  let component: ProjectBoardListComponent;
  let fixture: ComponentFixture<ProjectBoardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBoardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBoardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
