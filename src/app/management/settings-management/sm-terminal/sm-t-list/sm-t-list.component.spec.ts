import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTListComponent } from './sm-t-list.component';

describe('SmTListComponent', () => {
  let component: SmTListComponent;
  let fixture: ComponentFixture<SmTListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
