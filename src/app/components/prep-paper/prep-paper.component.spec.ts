import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepPaperComponent } from './prep-paper.component';

describe('PrepPaperComponent', () => {
  let component: PrepPaperComponent;
  let fixture: ComponentFixture<PrepPaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepPaperComponent]
    });
    fixture = TestBed.createComponent(PrepPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
