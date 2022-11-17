import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCropsComponent } from './import-crops.component';

describe('ImportCropsComponent', () => {
  let component: ImportCropsComponent;
  let fixture: ComponentFixture<ImportCropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCropsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
