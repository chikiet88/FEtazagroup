import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { HelpCenterService } from '../../apps/help-center/help-center.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
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
        private _cauhinhService: CauhinhService,
        private _nhanvienService: NhanvienService,
        )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
       
        return forkJoin([
            this._cauhoiService.getAllHotro(),
            this._cauhinhService.getCauhinhs(),
            this._cauhinhService.getAllDanhmuc(),
            this._nhanvienService.getNhanviens(),
        ]);
    }
}
@Injectable({
    providedIn: 'root'
})
export class HuongdanResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _cauhoiService: CauhoiService,
        private _cauhinhService: CauhinhService,
        private _nhanvienService: NhanvienService,
        )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
       
        return forkJoin([
            this._cauhoiService.getAllHotro(),
            this._cauhinhService.getCauhinhs(),
            this._cauhinhService.getAllDanhmuc(),
            this._nhanvienService.getNhanviens(),
        ]);
    }
}
