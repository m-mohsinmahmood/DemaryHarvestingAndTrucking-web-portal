import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelsMilesComponent } from './fuels-miles.component';

describe('FuelsMilesComponent', () => {
  let component: FuelsMilesComponent;
  let fixture: ComponentFixture<FuelsMilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelsMilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelsMilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
