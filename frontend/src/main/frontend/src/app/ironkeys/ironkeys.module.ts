import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { IronkeysComponent } from './ironkeys.component';
import { IronkeysService } from './shared/ironkeys.service';
import { IronkeyFormComponent } from './ironkey-form/ironkey-form.component';
import { TranslateModule } from "ng2-translate";

/* Angular Material */
import {DialogOverviewExampleDialog } from './ironkeys.component';
import {DialogOverviewExampleDialog4 } from './ironkeys.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule, 
    RouterModule,
    HttpModule,
    TranslateModule,

    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    IronkeysComponent,
    IronkeyFormComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog4
  ],
  exports: [
    IronkeysComponent
  ],
  providers: [
    IronkeysService
  ],
  entryComponents:[
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog4
  ]
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class IronkeysModule { }