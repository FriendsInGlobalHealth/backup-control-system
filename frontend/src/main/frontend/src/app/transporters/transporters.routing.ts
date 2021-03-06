import { Routes, RouterModule } from '@angular/router';
import { TransportersComponent } from './transporters.component';
import { TransporterFormComponent } from "./transporter-form/transporter-form.component";
import { AuthManagerTransportersRead } from './authmanagerread';
import { AuthManagerTransportersEdit } from './authmanageredit';

const transportersRoutes: Routes = [
  { path: 'transporters', component: TransportersComponent, pathMatch: 'full', canActivate: [AuthManagerTransportersRead] },
  { path: 'transporters/new', component: TransporterFormComponent, canActivate: [AuthManagerTransportersEdit] },
  { path: 'transporters/:uid', component: TransporterFormComponent, canActivate: [AuthManagerTransportersEdit] }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const transportersRouting = RouterModule.forChild(transportersRoutes);
