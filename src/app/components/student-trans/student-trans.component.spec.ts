import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTransComponent } from './student-trans.component';

describe('StudentTransComponent', () => {
  let component: StudentTransComponent;
  let fixture: ComponentFixture<StudentTransComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTransComponent]
    });
    fixture = TestBed.createComponent(StudentTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
