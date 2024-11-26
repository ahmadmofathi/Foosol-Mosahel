import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonQuestionComponent } from './common-question.component';

describe('CommonQuestionComponent', () => {
  let component: CommonQuestionComponent;
  let fixture: ComponentFixture<CommonQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonQuestionComponent]
    });
    fixture = TestBed.createComponent(CommonQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
