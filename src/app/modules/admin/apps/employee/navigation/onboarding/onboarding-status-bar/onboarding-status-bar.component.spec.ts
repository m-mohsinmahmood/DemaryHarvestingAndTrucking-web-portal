import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingStatusBarComponent } from './onboarding-status-bar.component';

describe('OnboardingStatusBarComponent', () => {
  let component: OnboardingStatusBarComponent;
  let fixture: ComponentFixture<OnboardingStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingStatusBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
