import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddMachineryComponent } from './update-add.component';

describe('UpdateComponent', () => {
  let component: UpdateAddMachineryComponent;
  let fixture: ComponentFixture<UpdateAddMachineryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAddMachineryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
