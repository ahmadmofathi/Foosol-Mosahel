import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSkillsComponent } from './main-skills.component';

describe('MainSkillsComponent', () => {
  let component: MainSkillsComponent;
  let fixture: ComponentFixture<MainSkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainSkillsComponent]
    });
    fixture = TestBed.createComponent(MainSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
