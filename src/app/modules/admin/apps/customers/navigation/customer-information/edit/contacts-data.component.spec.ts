import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsDataComponent } from './contacts-data.component';

describe('ContactsDataComponent', () => {
  let component: ContactsDataComponent;
  let fixture: ComponentFixture<ContactsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
