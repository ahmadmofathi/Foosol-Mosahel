import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashComponent } from './teacher-dash.component';

describe('TeacherDashComponent', () => {
  let component: TeacherDashComponent;
  let fixture: ComponentFixture<TeacherDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherDashComponent]
    });
    fixture = TestBed.createComponent(TeacherDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
