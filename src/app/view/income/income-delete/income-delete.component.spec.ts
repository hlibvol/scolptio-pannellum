import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeDeleteComponent } from './income-delete.component';


describe('UserRoleDeleteComponent', () => {
  let component: IncomeDeleteComponent;
  let fixture: ComponentFixture<IncomeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeDeleteComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
