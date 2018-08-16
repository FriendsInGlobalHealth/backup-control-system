/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthManagerEvaluationsEdit implements CanActivate {

    constructor(public router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (window.sessionStorage.getItem('authenticated') == "Sim" && (
            window.sessionStorage.getItem('ROLE_SIS'))
        ) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}