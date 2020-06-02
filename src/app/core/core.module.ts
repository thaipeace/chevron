import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from '@shared/shared.module';
import {RouterModule} from '@angular/router';
import {NoPermissionComponent} from '@app/core/no-permission/no-permission.component';
import {PageHeaderStatusComponent} from './page-header-status/page-header-status.component';
import {TableTopActionsComponent} from './table-top-actions/table-top-actions.component';
import {MatButtonModule} from '@angular/material/button';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';
import {HeaderAccountComponent} from '@app/core/header/header-account/header-account.component';
import {NotfoundComponent} from './notfound/notfound.component';
import {FmDriverModule} from '@app/management/fleet-management/fm-driver/fm-driver.module';
import {SlideBarDynamicModule} from '@app/core/slide-bar-dynamic/slide-bar-dynamic.module';
import {HeaderDropdownMenusComponent} from './header/header-dropdown-menus/header-dropdown-menus.component';
import {MenuBarComponent} from './menu-bar/menu-bar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    FmDriverModule,
    SlideBarDynamicModule
  ],
  entryComponents: [AboutDialogComponent],
  exports: [HeaderComponent, FooterComponent, MenuBarComponent,
    NoPermissionComponent, PageHeaderStatusComponent, TableTopActionsComponent, NotfoundComponent,
    SlideBarDynamicModule
  ],
  declarations: [HeaderComponent, FooterComponent,
    NoPermissionComponent, PageHeaderStatusComponent, TableTopActionsComponent,
    HeaderAccountComponent,
    AboutDialogComponent, NotfoundComponent, HeaderDropdownMenusComponent, MenuBarComponent,
  ],
})
export class CoreModule {
}
