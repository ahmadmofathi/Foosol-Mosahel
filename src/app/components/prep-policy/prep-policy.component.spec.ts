import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepPolicyComponent } from './prep-policy.component';

describe('PrepPolicyComponent', () => {
  let component: PrepPolicyComponent;
  let fixture: ComponentFixture<PrepPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepPolicyComponent]
    });
    fixture = TestBed.createComponent(PrepPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
