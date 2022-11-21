import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFieldsComponent } from './import-fields.component';

describe('ImportFieldsComponent', () => {
  let component: ImportFieldsComponent;
  let fixture: ComponentFixture<ImportFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
