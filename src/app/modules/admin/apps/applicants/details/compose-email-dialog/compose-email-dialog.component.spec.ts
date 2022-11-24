import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeEmailDialogComponent } from './compose-email-dialog.component';

describe('ComposeEmailDialogComponent', () => {
  let component: ComposeEmailDialogComponent;
  let fixture: ComponentFixture<ComposeEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeEmailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
