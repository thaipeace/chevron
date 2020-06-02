import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmListComponent } from './om-list.component';

describe('OmListComponent', () => {
  let component: OmListComponent;
  let fixture: ComponentFixture<OmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
