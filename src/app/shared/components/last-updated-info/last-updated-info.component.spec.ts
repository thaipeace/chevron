import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastUpdatedInfoComponent } from './last-updated-info.component';

describe('LastUpdatedInfoComponent', () => {
  let component: LastUpdatedInfoComponent;
  let fixture: ComponentFixture<LastUpdatedInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastUpdatedInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastUpdatedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
