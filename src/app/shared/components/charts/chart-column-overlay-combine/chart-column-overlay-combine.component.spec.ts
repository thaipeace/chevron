import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnOverlayComponent } from './chart-column-overlay-combine.component';

describe('ChartColumnOverlayComponent', () => {
    let component: ChartColumnOverlayComponent;
    let fixture: ComponentFixture<ChartColumnOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChartColumnOverlayComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartColumnOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
