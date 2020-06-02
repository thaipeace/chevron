import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DEFAULT_VALUES } from '@shared/constants/config.constant';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { ParamsService } from '@app/shared/services/params.service';

@Component({
    selector: 'app-about-dialog',
    templateUrl: './about-dialog.component.html',
    styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent extends DefaultDialogComponent implements OnInit {
    version;
    siteParam: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AboutDialogComponent>,
        private paramsService: ParamsService
    ) {
        super(dialogRef);

        this.paramsService.params.subscribe(result => {
            if (!result.params) {
                this.paramsService.getAllParams();
            } else {
                this.siteParam = {
                    solutionName: result.params.find(p => p.VarName === 'Solution Name'),
                    companyName: result.params.find(p => p.VarName === 'Company Name'),
                    legalText: result.params.find(p => p.VarName === 'Legal Text')
                };
            }
        });
    }

    ngOnInit() {
        this.version = DEFAULT_VALUES.VERSION;
        this.paramsService.broadcastParams();
    }

}
