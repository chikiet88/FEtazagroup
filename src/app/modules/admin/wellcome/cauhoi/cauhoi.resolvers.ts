import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { HelpCenterService } from '../../apps/help-center/help-center.service';
import { CauhoiService } from './cauhoi.service'; 

@Injectable({
    providedIn: 'root'
})
export class CauhoiResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _cauhoiService: CauhoiService,
        private _helpCenterService: HelpCenterService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
       
        return forkJoin([
            this._cauhoiService.getData(),
            this._helpCenterService.getAllFaqs()
        ]);
    }
}
