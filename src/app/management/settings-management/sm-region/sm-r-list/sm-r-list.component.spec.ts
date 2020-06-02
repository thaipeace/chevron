import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmRListComponent } from './sm-r-list.component';

describe('SmRListComponent', () => {
  let component: SmRListComponent;
  let fixture: ComponentFixture<SmRListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
