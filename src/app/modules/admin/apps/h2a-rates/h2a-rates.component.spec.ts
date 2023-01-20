import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2aRatesComponent } from './h2a-rates.component';

describe('H2aRatesComponent', () => {
  let component: H2aRatesComponent;
  let fixture: ComponentFixture<H2aRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ H2aRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(H2aRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
