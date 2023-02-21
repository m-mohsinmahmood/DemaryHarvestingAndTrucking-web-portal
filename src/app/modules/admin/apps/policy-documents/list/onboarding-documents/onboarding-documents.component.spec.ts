import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingDocumentsComponent } from './onboarding-documents.component';

describe('OnboardingDocumentsComponent', () => {
  let component: OnboardingDocumentsComponent;
  let fixture: ComponentFixture<OnboardingDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
