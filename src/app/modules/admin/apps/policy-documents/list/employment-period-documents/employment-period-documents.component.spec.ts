import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentPeriodDocumentsComponent } from './employment-period-documents.component';

describe('EmploymentPeriodDocumentsComponent', () => {
  let component: EmploymentPeriodDocumentsComponent;
  let fixture: ComponentFixture<EmploymentPeriodDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentPeriodDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentPeriodDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
