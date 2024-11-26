import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDegreeComponent } from './list-degree.component';

describe('ListDegreeComponent', () => {
  let component: ListDegreeComponent;
  let fixture: ComponentFixture<ListDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDegreeComponent]
    });
    fixture = TestBed.createComponent(ListDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
