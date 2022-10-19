import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantdataComponent } from './applicantdata.component';

describe('ApplicantdataComponent', () => {
  let component: ApplicantdataComponent;
  let fixture: ComponentFixture<ApplicantdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantdataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
