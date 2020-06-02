import { Component } from '@angular/core';
import { WsService } from './shared/services/ws.service';
import { ActivationEnd, Router } from '@angular/router';
import { SideBarService } from '@shared/services/side-bar.service';
import { ParamsService } from './shared/services/params.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/state/app.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private _wsService: WsService,
        private _Router: Router,
        private _SideBarService: SideBarService,
        private paramsService: ParamsService,
        private store: Store<AppState>
    ) {
        this._Router.events
            .subscribe((route) => {
                if (route instanceof ActivationEnd) {
                    // must after ActivationEnd 
                    this._SideBarService.close();
                }
            });

        this.paramsService.params.subscribe(result => {
            if (!result.params.length) {
                this.paramsService.getAllParams(true);
            } else {
                let siteName = result.params.find(p => p.VarName === "Solution Name");
                let siteTitleElm = document.querySelector('#site-name');
                siteTitleElm.textContent = siteName ? siteName.VarValue : 'Atomiton Chevron';
            }
        });

        // this.paramsService.icons.subscribe(result => {
        //     if (!result.icons || !result.icons.length) {
        //         this.paramsService.getAllIcons(true);
        //     } else {
        //         let fav = result.icons.find(i => i.type === 'favicon');
        //         if (fav) {
        //             let link;
        //             link = document.querySelector('[rel="icon"]');
        //             let imageUrl = 'data:image/png;base64,' + fav.value;
        //             link.setAttribute("href", imageUrl);
        //         }
        //     }
        // });
    }

    ngOnInit() {
        this._wsService.startNotificationWS();
        this.paramsService.broadcastParams();
        this.paramsService.getLogo();
    }
}
