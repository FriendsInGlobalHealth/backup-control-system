/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login/login-form/login-form.component";
import { NotFoundComponent } from './not-found/not-found.component';
const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: LoginFormComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];

/** 
* @author Damasceno Lopes
*/
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
