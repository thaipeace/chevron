import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTpListComponent } from './sm-tp-list.component';

describe('SmTpListComponent', () => {
  let component: SmTpListComponent;
  let fixture: ComponentFixture<SmTpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
