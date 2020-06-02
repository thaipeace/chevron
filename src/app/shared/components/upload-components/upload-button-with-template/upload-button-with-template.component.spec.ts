import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonWithTemplateComponent } from './upload-button-with-template.component';

describe('UploadButtonWithTemplateComponent', () => {
  let component: UploadButtonWithTemplateComponent;
  let fixture: ComponentFixture<UploadButtonWithTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadButtonWithTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadButtonWithTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
