import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareQuestionnaireComponent } from './prepare-questionnaire.component';

describe('PrepareQuestionnaireComponent', () => {
  let component: PrepareQuestionnaireComponent;
  let fixture: ComponentFixture<PrepareQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareQuestionnaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
