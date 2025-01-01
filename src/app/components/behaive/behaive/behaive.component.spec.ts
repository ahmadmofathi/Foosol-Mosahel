import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaiveComponent } from './behaive.component';

describe('BehaiveComponent', () => {
  let component: BehaiveComponent;
  let fixture: ComponentFixture<BehaiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BehaiveComponent]
    });
    fixture = TestBed.createComponent(BehaiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
