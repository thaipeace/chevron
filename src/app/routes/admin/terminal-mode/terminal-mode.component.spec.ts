import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalModeComponent } from './terminal-mode.component';

describe('TerminalModeComponent', () => {
  let component: TerminalModeComponent;
  let fixture: ComponentFixture<TerminalModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
