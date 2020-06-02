import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionHistoricalComponent } from './connection-historical.component';

describe('ConnectionHistoricalComponent', () => {
  let component: ConnectionHistoricalComponent;
  let fixture: ComponentFixture<ConnectionHistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionHistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
