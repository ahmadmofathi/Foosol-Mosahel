import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTeacherComponent } from './exam-teacher.component';

describe('ExamTeacherComponent', () => {
  let component: ExamTeacherComponent;
  let fixture: ComponentFixture<ExamTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamTeacherComponent]
    });
    fixture = TestBed.createComponent(ExamTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
