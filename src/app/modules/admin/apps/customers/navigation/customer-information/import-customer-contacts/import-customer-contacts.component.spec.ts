import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCustomerContactsComponent } from './import-customer-contacts.component';

describe('ImportCustomerContactsComponent', () => {
  let component: ImportCustomerContactsComponent;
  let fixture: ComponentFixture<ImportCustomerContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCustomerContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCustomerContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
