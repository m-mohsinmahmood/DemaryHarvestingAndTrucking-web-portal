import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDataComponent } from './farm-data.component';

describe('FarmDataComponent', () => {
  let component: FarmDataComponent;
  let fixture: ComponentFixture<FarmDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
