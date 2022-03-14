import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitationDeleteComponent } from './invitation-delete.component';


describe('InvitationDeleteComponent', () => {
  let component: InvitationDeleteComponent;
  let fixture: ComponentFixture<InvitationDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationDeleteComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
