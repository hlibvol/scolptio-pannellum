import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDocsListComponent } from './contract-docs-list.component';

describe('ContractDocsListComponent', () => {
  let component: ContractDocsListComponent;
  let fixture: ComponentFixture<ContractDocsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDocsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDocsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
