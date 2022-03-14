import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureEditComponent } from './expenditure-edit.component';

describe('ExpenditureEditComponent', () => {
  let component: ExpenditureEditComponent;
  let fixture: ComponentFixture<ExpenditureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenditureEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
