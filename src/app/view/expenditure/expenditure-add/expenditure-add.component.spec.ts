import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureAddComponent } from './expenditure-add.component';

describe('ExpenditureAddComponent', () => {
  let component: ExpenditureAddComponent;
  let fixture: ComponentFixture<ExpenditureAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenditureAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
