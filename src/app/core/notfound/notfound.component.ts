import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

const errorRender = {
    '404': {
        code: '404',
        title: 'Page not found',
        desc: 'Sorry! The page you were looking for doesn\'t exist.'
    },
    '403': {
        code: '403',
        title: 'Forbidden',
        desc: 'Sorry! You don\'t have permission to access this page.'
    }
};

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

    public type: string = '';
    public render: any = {};

    constructor(
        private route: ActivatedRoute,
        private _Router: Router
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.type = params['type'];
            this.render = this.type ? errorRender[this.type] : errorRender['404'];
        });

        window.onhashchange = () => this.onBack();
    }

    onBack() {
        this._Router.navigate(['/', 'logout']);
    }

}
