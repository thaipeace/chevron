import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageQuestionDialogComponent } from './message-question-dialog.component';

describe('MessageQuestionDialogComponent', () => {
  let component: MessageQuestionDialogComponent;
  let fixture: ComponentFixture<MessageQuestionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageQuestionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
