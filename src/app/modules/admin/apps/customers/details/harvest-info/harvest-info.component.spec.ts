import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestInfoComponent } from './harvest-info.component';

describe('HarvestInfoComponent', () => {
  let component: HarvestInfoComponent;
  let fixture: ComponentFixture<HarvestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
