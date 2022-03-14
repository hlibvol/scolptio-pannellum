import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenditureDeleteComponent } from './expenditure-delete.component';


describe('UserRoleDeleteComponent', () => {
  let component: ExpenditureDeleteComponent;
  let fixture: ComponentFixture<ExpenditureDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenditureDeleteComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
