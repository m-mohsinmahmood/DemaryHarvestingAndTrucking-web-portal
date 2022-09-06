import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddComponent } from './update-add.component';

describe('UpdateComponent', () => {
  let component: UpdateAddComponent;
  let fixture: ComponentFixture<UpdateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
