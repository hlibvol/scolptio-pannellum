import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBoardAddComponent } from './project-board-add.component';

describe('ProjectBoardAddComponent', () => {
  let component: ProjectBoardAddComponent;
  let fixture: ComponentFixture<ProjectBoardAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBoardAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBoardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
