import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadByDropComponentComponent } from './upload-by-drop-component.component';

describe('UploadByDropComponentComponent', () => {
  let component: UploadByDropComponentComponent;
  let fixture: ComponentFixture<UploadByDropComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadByDropComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadByDropComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
