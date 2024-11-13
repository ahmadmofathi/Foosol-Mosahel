import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonTransferComponent } from './reason-transfer.component';

describe('ReasonTransferComponent', () => {
  let component: ReasonTransferComponent;
  let fixture: ComponentFixture<ReasonTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonTransferComponent]
    });
    fixture = TestBed.createComponent(ReasonTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
