import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithSuggestionsComponent } from './search-with-suggestions.component';

describe('SearchWithSuggestionsComponent', () => {
  let component: SearchWithSuggestionsComponent;
  let fixture: ComponentFixture<SearchWithSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchWithSuggestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWithSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
