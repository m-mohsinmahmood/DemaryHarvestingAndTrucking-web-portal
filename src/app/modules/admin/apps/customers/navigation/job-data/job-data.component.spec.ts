import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDataComponent } from './job-data.component';

describe('JobDataComponent', () => {
  let component: JobDataComponent;
  let fixture: ComponentFixture<JobDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
