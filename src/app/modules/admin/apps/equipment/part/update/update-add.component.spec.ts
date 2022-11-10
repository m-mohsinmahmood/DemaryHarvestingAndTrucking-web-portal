import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddPartsComponent } from './update-add.component';

describe('UpdateComponent', () => {
  let component: UpdateAddPartsComponent;
  let fixture: ComponentFixture<UpdateAddPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAddPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
