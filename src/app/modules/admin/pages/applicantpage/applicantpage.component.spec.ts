import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantpageComponent } from './applicantpage.component';

describe('ApplicantpageComponent', () => {
  let component: ApplicantpageComponent;
  let fixture: ComponentFixture<ApplicantpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
