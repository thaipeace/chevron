import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserProfileDialogComponent } from './update-user-profile-dialog.component';

describe('UpdateUserProfileDialogComponent', () => {
  let component: UpdateUserProfileDialogComponent;
  let fixture: ComponentFixture<UpdateUserProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
