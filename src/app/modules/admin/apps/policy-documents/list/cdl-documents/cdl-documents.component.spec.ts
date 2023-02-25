import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdlDocumentsComponent } from './cdl-documents.component';

describe('CdlDocumentsComponent', () => {
  let component: CdlDocumentsComponent;
  let fixture: ComponentFixture<CdlDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdlDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdlDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
