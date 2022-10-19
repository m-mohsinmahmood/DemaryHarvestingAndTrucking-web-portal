import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddPropertyComponent } from './update-add.component';

describe('UpdateComponent', () => {
  let component: UpdateAddPropertyComponent;
  let fixture: ComponentFixture<UpdateAddPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAddPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
