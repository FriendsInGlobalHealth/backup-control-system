import { Routes, RouterModule } from '@angular/router';
import { EvaluationsComponent } from './evaluations.component';
import { EvaluationFormComponent } from "./evaluation-form/evaluation-form.component";
import { AuthManagerEvaluationsRead } from './authmanagerread';
import { AuthManagerEvaluationsEdit } from './authmanageredit';

const evaluationsRoutes: Routes = [
  { path: 'evaluations', component: EvaluationsComponent, pathMatch: 'full', canActivate: [AuthManagerEvaluationsRead] },
  { path: 'evaluations/new', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] },
  { path: 'evaluations/:uid', component: EvaluationFormComponent, canActivate: [AuthManagerEvaluationsEdit] }
];

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export const evaluationsRouting = RouterModule.forChild(evaluationsRoutes);
