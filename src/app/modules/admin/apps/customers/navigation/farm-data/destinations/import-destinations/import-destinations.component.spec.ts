import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDestinationsComponent } from './import-destinations.component';

describe('ImportDestinationsComponent', () => {
  let component: ImportDestinationsComponent;
  let fixture: ComponentFixture<ImportDestinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDestinationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
