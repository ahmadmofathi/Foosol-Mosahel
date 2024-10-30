import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignStudentComponent } from './sign-student.component';

describe('SignStudentComponent', () => {
  let component: SignStudentComponent;
  let fixture: ComponentFixture<SignStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignStudentComponent]
    });
    fixture = TestBed.createComponent(SignStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
