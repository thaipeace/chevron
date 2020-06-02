import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteLayoutComponent } from './remote-layout.component';

describe('RemoteLayoutComponent', () => {
  let component: RemoteLayoutComponent;
  let fixture: ComponentFixture<RemoteLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
