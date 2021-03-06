import { Routes, RouterModule } from '@angular/router';
import { AuthManagerDistrictsRead } from './authmanagerread';
import { AuthManagerDistrictsEdit } from './authmanageredit';
import { DistrictsComponent } from './districts.component';
import { DistrictFormComponent } from "./district-form/district-form.component";

const districtsRoutes: Routes = [
  { path: 'districts', component: DistrictsComponent, pathMatch: 'full', canActivate: [AuthManagerDistrictsRead] },
  { path: 'districts/new', component: DistrictFormComponent, canActivate: [AuthManagerDistrictsEdit] },
  { path: 'districts/:uuid', component: DistrictFormComponent, canActivate: [AuthManagerDistrictsEdit] }
];

/** 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export const districtsRouting = RouterModule.forChild(districtsRoutes);
