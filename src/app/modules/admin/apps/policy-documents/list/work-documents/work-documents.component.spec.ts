import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDocumentsComponent } from './work-documents.component';

describe('WorkDocumentsComponent', () => {
  let component: WorkDocumentsComponent;
  let fixture: ComponentFixture<WorkDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
