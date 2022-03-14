import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDocsEditComponent } from './contract-docs-edit.component';

describe('ContractDocsEditComponent', () => {
  let component: ContractDocsEditComponent;
  let fixture: ComponentFixture<ContractDocsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDocsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDocsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
