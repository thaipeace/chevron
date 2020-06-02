import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHlListComponent } from './sm-hl-list.component';

describe('SmHlListComponent', () => {
  let component: SmHlListComponent;
  let fixture: ComponentFixture<SmHlListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHlListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
