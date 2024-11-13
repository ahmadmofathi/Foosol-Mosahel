import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalScheduleComponent } from './final-schedule.component';

describe('FinalScheduleComponent', () => {
  let component: FinalScheduleComponent;
  let fixture: ComponentFixture<FinalScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalScheduleComponent]
    });
    fixture = TestBed.createComponent(FinalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
