import { Component, OnInit } from '@angular/core';
import { ParamsService } from '@app/shared/services/params.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/state/app.state';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.scss']
})
export class AuthenticationPageComponent implements OnInit {

  public solutionName: any= {};
  public settingsLogo: string = '';

  constructor(
    private paramsService: ParamsService,
    private store: Store<AppState>
  ) {
    this.paramsService.params.subscribe(result => {
      if (!result.params) {
        this.paramsService.getAllParams(true);
      } else {
        this.solutionName = result.params.find(p => p.VarName === 'Solution Name');
      }
    });

    let logoStore = this.store.select('image');
    logoStore.subscribe(data => {
      this.settingsLogo = data[data.length-1].base64;
    });
   }

  ngOnInit() {
    this.paramsService.broadcastParams();
  }

}
