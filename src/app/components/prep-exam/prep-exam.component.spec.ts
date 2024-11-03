import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepExamComponent } from './prep-exam.component';

describe('PrepExamComponent', () => {
  let component: PrepExamComponent;
  let fixture: ComponentFixture<PrepExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepExamComponent]
    });
    fixture = TestBed.createComponent(PrepExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
