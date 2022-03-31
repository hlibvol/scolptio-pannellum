import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBoardEditComponent } from './project-board-edit.component';

describe('ProjectBoardEditComponent', () => {
  let component: ProjectBoardEditComponent;
  let fixture: ComponentFixture<ProjectBoardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBoardEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBoardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
