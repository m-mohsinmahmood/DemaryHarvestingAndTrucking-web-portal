import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousDocumentsComponent } from './miscellaneous-documents.component';

describe('MiscellaneousDocumentsComponent', () => {
  let component: MiscellaneousDocumentsComponent;
  let fixture: ComponentFixture<MiscellaneousDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
