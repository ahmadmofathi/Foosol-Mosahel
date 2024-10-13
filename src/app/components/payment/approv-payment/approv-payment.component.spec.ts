import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovPaymentComponent } from './approv-payment.component';

describe('ApprovPaymentComponent', () => {
  let component: ApprovPaymentComponent;
  let fixture: ComponentFixture<ApprovPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovPaymentComponent]
    });
    fixture = TestBed.createComponent(ApprovPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
