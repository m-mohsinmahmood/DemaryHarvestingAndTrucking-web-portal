import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDataComponent } from './rate-data.component';

describe('RateDataComponent', () => {
  let component: RateDataComponent;
  let fixture: ComponentFixture<RateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
