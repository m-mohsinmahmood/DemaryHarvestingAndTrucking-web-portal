import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceArticleComponent } from './performance-article.component';

describe('PerformanceArticleComponent', () => {
  let component: PerformanceArticleComponent;
  let fixture: ComponentFixture<PerformanceArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
