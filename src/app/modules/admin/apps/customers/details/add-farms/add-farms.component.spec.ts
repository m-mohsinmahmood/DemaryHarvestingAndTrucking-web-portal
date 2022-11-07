import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFarmsComponent } from './add-farms.component';

describe('AddFarmsComponent', () => {
  let component: AddFarmsComponent;
  let fixture: ComponentFixture<AddFarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFarmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
