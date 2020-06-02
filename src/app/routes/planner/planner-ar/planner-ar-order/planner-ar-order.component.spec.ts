import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerArOrderNewComponent } from './app-planner-ar-order-new';


describe('PlannerArOrderComponent', () => {
  let component: PlannerArOrderNewComponent;
  let fixture: ComponentFixture<PlannerArOrderNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerArOrderNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerArOrderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
