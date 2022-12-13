import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRepairComponent } from './main-repair.component';

describe('MainRepairComponent', () => {
  let component: MainRepairComponent;
  let fixture: ComponentFixture<MainRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
