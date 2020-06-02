import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImNewComponent } from './im-new.component';

describe('ImNewComponent', () => {
  let component: ImNewComponent;
  let fixture: ComponentFixture<ImNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
