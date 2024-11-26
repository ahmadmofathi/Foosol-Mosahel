import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPaperComponent } from './work-paper.component';

describe('WorkPaperComponent', () => {
  let component: WorkPaperComponent;
  let fixture: ComponentFixture<WorkPaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkPaperComponent]
    });
    fixture = TestBed.createComponent(WorkPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
