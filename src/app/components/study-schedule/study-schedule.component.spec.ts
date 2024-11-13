import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyScheduleComponent } from './study-schedule.component';

describe('StudyScheduleComponent', () => {
  let component: StudyScheduleComponent;
  let fixture: ComponentFixture<StudyScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyScheduleComponent]
    });
    fixture = TestBed.createComponent(StudyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
