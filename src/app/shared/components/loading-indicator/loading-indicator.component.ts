import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-loading-indicator',
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {
    @Input() hasBackDrop: boolean = false;

    @HostBinding('class.back-drop')
    public get hasBackDropClass(): boolean {
        return this.hasBackDrop;
    }
}
