import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesComponent } from './ques.component';

describe('QuesComponent', () => {
  let component: QuesComponent;
  let fixture: ComponentFixture<QuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuesComponent]
    });
    fixture = TestBed.createComponent(QuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
