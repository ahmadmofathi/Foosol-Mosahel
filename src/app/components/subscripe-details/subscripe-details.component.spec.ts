import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscripeDetailsComponent } from './subscripe-details.component';

describe('SubscripeDetailsComponent', () => {
  let component: SubscripeDetailsComponent;
  let fixture: ComponentFixture<SubscripeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscripeDetailsComponent]
    });
    fixture = TestBed.createComponent(SubscripeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
