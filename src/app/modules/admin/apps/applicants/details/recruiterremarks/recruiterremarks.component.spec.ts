import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterremarksComponent } from './recruiterremarks.component';

describe('RecruiterremarksComponent', () => {
  let component: RecruiterremarksComponent;
  let fixture: ComponentFixture<RecruiterremarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterremarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterremarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
