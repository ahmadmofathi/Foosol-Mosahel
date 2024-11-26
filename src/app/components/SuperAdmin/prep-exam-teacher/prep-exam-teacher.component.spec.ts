import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepExamTeacherComponent } from './prep-exam-teacher.component';

describe('PrepExamTeacherComponent', () => {
  let component: PrepExamTeacherComponent;
  let fixture: ComponentFixture<PrepExamTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepExamTeacherComponent]
    });
    fixture = TestBed.createComponent(PrepExamTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
