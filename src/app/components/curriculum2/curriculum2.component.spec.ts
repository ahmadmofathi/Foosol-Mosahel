import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Curriculum2Component } from './curriculum2.component';

describe('Curriculum2Component', () => {
  let component: Curriculum2Component;
  let fixture: ComponentFixture<Curriculum2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Curriculum2Component]
    });
    fixture = TestBed.createComponent(Curriculum2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
