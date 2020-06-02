import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthenticationService} from '@app/user-management/shared/services';
import {combineLatest} from 'rxjs';
import {DialogService} from '@shared/services/others/dialog.service';
import {SystemHelpDialogComponent} from '@app/shared/components/dialogs/system-help-dialog/system-help-dialog.component';
import {DefaultComponent} from '@shared/models/default/default-component.model';

@Component({
    selector: '[app-header-account]',
    templateUrl: './header-account.component.html',
    styleUrls: ['./header-account.component.scss'],
})
export class HeaderAccountComponent extends DefaultComponent implements OnInit {
    displayedName = '';
    imgSrc: string;
    roleName = '';
    showing: boolean = false;
    username = '';

    @HostListener('document:click', ['$event']) onClick($event) {
        if (!this._ElementRef.nativeElement.contains($event.target)) // or some similar check
        {
            this.showing = false;
        }
    }

    constructor(private _ElementRef: ElementRef,
                private _ActivatedRoute: ActivatedRoute,
                private _Router: Router,
                private _DialogService: DialogService,
                private _AuthenticationService: AuthenticationService,
    ) {
        super();
        combineLatest(
            this._AuthenticationService.loginedUserObservable,
        ).subscribe(([user]) => {
            if (user) {
                this.displayedName = user.name;
                this.username = user.username;
                this.roleName = user.roleName;
            }
        });

        this._AuthenticationService.dpUserObservable.subscribe((image: string) => {
            if (!!image) {
                this.imgSrc = `data:image/png;base64,${image}`;
            }
        });
    }

    ngOnInit() {
    }

    clickEvent() {
        this.showing = !this.showing;
    }

    logout() {
        this._Router.navigate(['/', 'logout'],);
    }

    systemHelp() {
        this._DialogService.open(SystemHelpDialogComponent);
    }
}
