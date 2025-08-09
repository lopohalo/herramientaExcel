import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasegeneralComponent } from './basegeneral.component';

describe('BasegeneralComponent', () => {
  let component: BasegeneralComponent;
  let fixture: ComponentFixture<BasegeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasegeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasegeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
