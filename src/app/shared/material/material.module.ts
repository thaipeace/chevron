import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatButtonModule, MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTreeModule, MatPaginatorIntl, MatSortModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule, MatButtonToggleModule,
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MaterialPaginator} from '@shared/material/material-paginator';

const cdkModules = [
    DragDropModule,
];

const materialModules = [
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatRippleModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatTreeModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ...cdkModules,
        ...materialModules,
    ],
    exports: [
        ...cdkModules,
        ...materialModules,
    ],
    providers: [{provide: MatPaginatorIntl, useClass: MaterialPaginator}],
})
export class MaterialModule {
}
