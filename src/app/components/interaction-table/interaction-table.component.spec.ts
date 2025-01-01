import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionTableComponent } from './interaction-table.component';

describe('InteractionTableComponent', () => {
  let component: InteractionTableComponent;
  let fixture: ComponentFixture<InteractionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteractionTableComponent]
    });
    fixture = TestBed.createComponent(InteractionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
