/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { UsersComponent } from './users.component';
import { UsersService } from './shared/users.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailsFormComponent } from './user-form/user-details-form.component';
import { MzTooltipModule, MzIconMdiModule, MzIconModule, MzModalModule, MzToastModule, MzButtonModule, MzInputModule,MzSelectModule,MzTabModule } from 'ng2-materialize';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from "ng2-translate";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpModule,
    MzTooltipModule,
    MzIconMdiModule,
    MzIconModule,
    MzModalModule,
    MzToastModule,
    NgxPaginationModule,
    MzButtonModule,
    MzInputModule,
    TranslateModule,
    MzSelectModule,
    MzTabModule
  ],
  declarations: [
    UsersComponent,
    UserFormComponent,
    UserDetailsFormComponent
  ],
  exports: [
    UsersComponent
  ],
  providers: [
    UsersService
  ]
})

/** 
* @author Damasceno Lopes
*/
export class UsersModule { }