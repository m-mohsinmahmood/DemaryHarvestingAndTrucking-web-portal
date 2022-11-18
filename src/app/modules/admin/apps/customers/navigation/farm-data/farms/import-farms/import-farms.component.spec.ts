import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFarmsComponent } from './import-farms.component';

describe('ImportFarmsComponent', () => {
  let component: ImportFarmsComponent;
  let fixture: ComponentFixture<ImportFarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFarmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
