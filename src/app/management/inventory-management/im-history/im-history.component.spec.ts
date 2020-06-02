import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImHistoryComponent } from './im-history.component';

describe('ImHistoryComponent', () => {
  let component: ImHistoryComponent;
  let fixture: ComponentFixture<ImHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
