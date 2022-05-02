import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillQuestionnaireComponent } from './fill-questionnaire.component';

describe('FillQuestionnaireComponent', () => {
  let component: FillQuestionnaireComponent;
  let fixture: ComponentFixture<FillQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillQuestionnaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
