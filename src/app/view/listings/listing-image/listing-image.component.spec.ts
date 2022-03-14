import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingImageComponent } from './listing-image.component';

describe('ListingImageComponent', () => {
  let component: ListingImageComponent;
  let fixture: ComponentFixture<ListingImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
