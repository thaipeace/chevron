import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpmTerminalComponent } from './mpm-terminal.component';

describe('MpmTerminalComponent', () => {
  let component: MpmTerminalComponent;
  let fixture: ComponentFixture<MpmTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpmTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpmTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
