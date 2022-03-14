import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsAddComponent } from './listings-add.component';

describe('ListingsAddComponent', () => {
  let component: ListingsAddComponent;
  let fixture: ComponentFixture<ListingsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
