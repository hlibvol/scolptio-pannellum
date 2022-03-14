import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplatesAddComponent } from './document-templates-add.component';

describe('DocumentTemplatesAddComponent', () => {
  let component: DocumentTemplatesAddComponent;
  let fixture: ComponentFixture<DocumentTemplatesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTemplatesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplatesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
