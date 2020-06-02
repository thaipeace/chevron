import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDocumentsComponent } from './help-documents.component';

describe('HelpDocumentsComponent', () => {
  let component: HelpDocumentsComponent;
  let fixture: ComponentFixture<HelpDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
