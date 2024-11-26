import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankqComponent } from './bankq.component';

describe('BankqComponent', () => {
  let component: BankqComponent;
  let fixture: ComponentFixture<BankqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankqComponent]
    });
    fixture = TestBed.createComponent(BankqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
