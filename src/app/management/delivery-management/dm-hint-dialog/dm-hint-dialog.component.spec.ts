import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmHintDialogComponent } from './dm-hint-dialog.component';

describe('DmHintDialogComponent', () => {
  let component: DmHintDialogComponent;
  let fixture: ComponentFixture<DmHintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmHintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmHintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
