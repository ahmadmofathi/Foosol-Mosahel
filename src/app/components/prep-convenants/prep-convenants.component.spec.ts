import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepConvenantsComponent } from './prep-convenants.component';

describe('PrepConvenantsComponent', () => {
  let component: PrepConvenantsComponent;
  let fixture: ComponentFixture<PrepConvenantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepConvenantsComponent]
    });
    fixture = TestBed.createComponent(PrepConvenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
